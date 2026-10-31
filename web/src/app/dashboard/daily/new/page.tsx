import { DailyForm } from '@/components/modules/daily/daily-form';

export default function NewDailyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <h1 className="text-2xl font-semibold">Nhật ký mới</h1>
      <DailyForm />
    </div>
  );
}
