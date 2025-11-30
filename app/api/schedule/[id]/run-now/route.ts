import { NextResponse } from 'next/server';
import { PrismaClient, ScheduleStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const job = await prisma.scheduledPost.findUnique({ where: { id } });
    if (!job) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    if (![ScheduleStatus.PENDING, ScheduleStatus.ERROR].includes(job.status)) {
      return NextResponse.json({ success: false, error: 'Cannot force run in current status' }, { status: 400 });
    }
    await prisma.scheduledPost.update({
      where: { id },
      data: { scheduledAt: new Date(), status: ScheduleStatus.PENDING }
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('[schedule.runNow]', e);
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}
