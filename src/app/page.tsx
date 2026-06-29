import EyeCanvas from '@/components/eye/EyeCanvas';
import ScrollContainer from '@/components/ScrollContainer';
import DotNav from '@/components/DotNav';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  return (
    <>
      <PageTransition />
      <EyeCanvas />
      <ScrollContainer />
      <DotNav />
    </>
  );
}
