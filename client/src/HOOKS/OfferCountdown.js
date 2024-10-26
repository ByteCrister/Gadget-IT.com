import React from 'react';
import Countdown from 'react-countdown';
import styles from '../styles/HomePageStyles/OfferCartProducts.module.css';
const getRemainTime = (days, hours, minutes, seconds, offStr) => {
    return (
        <div className={styles['offer-time-section']}>
            <span className={styles['offer-time-section-text']}>{offStr} </span>
            <div>
                {
                    [days, hours, minutes, seconds].map((time, index) => {
                        const time_ = Number(time) < 10 ? String('0' + time) : String(time);
                        let div = [];
                        for (let i = 0; i < time_.length; i++) {
                            div.push(<span className={styles['offer-time-section-time-text']}>{time_.charAt(i)}</span>)
                        }
                        return <div className={styles['offer-time-section-time-text-main']}>
                            <div>{[...div]}</div>
                            <span className={styles['offer-time-section-time-text-times']}>{index === 0 ? 'Days' : index === 1 ? 'Hours' : index === 2 ? 'Minutes' : 'Seconds'}</span>
                        </div>

                    })
                }
            </div>
        </div>
    )
}

const OfferCountdown = ({ startDate, endDate }) => {
    if (!startDate || !endDate) {
        return <span>Offer date information is missing.</span>;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <Countdown date={end} renderer={rendererEnd} />;
        }
        return (
            <>
                {getRemainTime(days, hours, minutes, seconds, 'OFFER STARTS IN')}
            </>
        );
    };

    const rendererEnd = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>Offer has ended!</span>;
        }
        return (
            <>
                {getRemainTime(days, hours, minutes, seconds, 'OFFER ENDS IN')}
            </>
        );
    };

    return <Countdown date={start > now ? start : end} renderer={renderer} />;
};
export default OfferCountdown;