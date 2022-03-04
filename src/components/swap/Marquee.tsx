import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  PriceBoardIcon,
  PriceFloatUpIcon,
  CloseRadiusIcon,
} from '~components/icon/Common';
export default function Marquee() {
  const marqueeRef = useRef(null);
  const [showMarquee, setShowMarquee] = useState(
    localStorage.getItem('marquee') == '1'
  );
  const [priceDataList, setPriceDataList] = useState([
    {
      symbol: 'REF',
      price: '$1.19',
      up: '23.58',
    },
    {
      symbol: 'wBTC',
      price: '$37,9825.47',
      up: '23.58',
    },
    {
      symbol: 'ETH',
      price: '$2,643.23',
      up: '23.58',
    },
    {
      symbol: 'wNEAR',
      price: '$8.44',
      down: '9.78',
    },
    {
      symbol: 'REF',
      price: '$1.19',
      up: '23.58',
    },
    {
      symbol: 'wBTC',
      price: '$37,9825.47',
      up: '23.58',
    },
    {
      symbol: 'ETH',
      price: '$2,643.23',
      up: '23.58',
    },
    {
      symbol: 'wNEAR',
      price: '$8.44',
      down: '9.78',
    },
  ]);
  const [isHover, setIsHover] = useState(false);
  const stop = () => {
    marqueeRef.current.stop();
    setIsHover(true);
  };
  const start = () => {
    marqueeRef.current.start();
    setIsHover(false);
  };
  const switchStatus = () => {
    const newStatus = !showMarquee;
    if (newStatus) {
      localStorage.setItem('marquee', '1');
    } else {
      localStorage.setItem('marquee', '0');
    }
    setShowMarquee(!showMarquee);
  };
  return (
    <div className="transform -translate-y-12 xs:-translate-y-5 md:-translate-y-5 relative h-8">
      <div
        onClick={switchStatus}
        className="flex items-center absolute right-0 w-28 h-8 bg-priceBoardColor rounded-l-full px-1.5 cursor-pointer text-primaryText hover:text-greenColor z-10"
      >
        <span className="flex items-center justify-center w-6 h-6 bg-black bg-opacity-30 rounded-full">
          {showMarquee ? (
            <CloseRadiusIcon></CloseRadiusIcon>
          ) : (
            <PriceBoardIcon></PriceBoardIcon>
          )}
        </span>
        <label className="text-xs ml-1.5 cursor-pointer">
          {showMarquee ? (
            <FormattedMessage id="close"></FormattedMessage>
          ) : (
            <FormattedMessage id="price_board"></FormattedMessage>
          )}
        </label>
      </div>
      {showMarquee ? (
        <div className="mr-20 bg-cardBg h-8">
          <marquee
            scrollamount="10"
            onMouseOver={() => {
              stop();
            }}
            onMouseOut={() => {
              start();
            }}
            ref={marqueeRef}
          >
            <div className={`flex items-center h-8`}>
              {priceDataList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`flex items-center text-white rounded-md mr-16 px-4 py-1 xs:mr-6 md:mr-6 hover:bg-black hover:bg-opacity-20`}
                  >
                    <label className="text-sm text-white font-semibold">
                      {item.symbol}
                    </label>
                    <label className="text-sm text-white ml-2.5 mr-1.5">
                      {item.price}
                    </label>
                    {item.up ? (
                      <span className="flex items-center text-xs text-lightGreenColor">
                        <label>{item.up}</label>{' '}
                        <PriceFloatUpIcon></PriceFloatUpIcon>
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-lightRedColor">
                        <label>{item.down}</label>{' '}
                        <PriceFloatUpIcon></PriceFloatUpIcon>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </marquee>
        </div>
      ) : null}
    </div>
  );
}
