import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import { prisma } from '@/lib/db';
import { getCurrentCandidate } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const candidate = await getCurrentCandidate();
    if (!candidate) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (fileName.endsWith('.pdf')) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || '';
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const docxResult = await mammoth.extractRawText({ buffer });
      extractedText = docxResult.value || '';
    } else {
      // Fallback for plain text files
      extractedText = buffer.toString('utf-8');
    }

    // Clean whitespace and limit to max 4000 chars for context efficiency
    const cleanText = extractedText.replace(/\s+/g, ' ').trim().slice(0, 4000);

    if (!cleanText || cleanText.length < 15) {
      return NextResponse.json({
        error: 'Unable to extract legible text from file. Please ensure it contains plain text.',
      }, { status: 400 });
    }

    // Save resumeText in database for the candidate
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { resumeText: cleanText },
    });

    const excerpt = cleanText.length > 280 ? cleanText.slice(0, 280) + '...' : cleanText;

    return NextResponse.json({
      success: true,
      excerpt,
      resumeText: cleanText,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error processing resume upload';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
