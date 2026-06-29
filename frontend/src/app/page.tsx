import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect the root domain to the main meetings dashboard
  redirect('/meetings');
}
