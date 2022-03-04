import React from 'react';
import SwapCard from '~components/swap/SwapCard';
import Marquee from '~components/swap/Marquee';
import Loading from '~components/layout/Loading';
import { useWhitelistTokens } from '../state/token';

function SwapPage() {
  const allTokens = useWhitelistTokens();
  if (!allTokens) return <Loading />;

  return (
    <div className="swap">
      <Marquee></Marquee>
      <section className="lg:w-560px md:w-5/6 xs:w-full xs:p-2 m-auto relative">
        <SwapCard allTokens={allTokens} />
      </section>
    </div>
  );
}

export default SwapPage;
