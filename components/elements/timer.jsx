import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'


const Timer = forwardRef((props, ref) => {
   
	
	const Ref = useRef(null);
	const [timer, setTimer] = useState('00:60');

    useImperativeHandle(ref, () => ({

        getAlert() {
            clearTimer(getDeadTime());
        }
    
      }));

      useEffect(() => {
		clearTimer(getDeadTime());
	}, []);

	const getTimeRemaining = (e) => {
		const total = Date.parse(e) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / 1000 * 60 * 60) % 24);
		return {
			total, hours, minutes, seconds
		};
	}


	const startTimer = (e) => {
		let { total, hours, minutes, seconds }
					= getTimeRemaining(e);
		if (total >= 0) {

			
			setTimer(
				(minutes > 9 ? minutes : '0' + minutes) + ':'
				+ (seconds > 9 ? seconds : '0' + seconds)
			)
           
		}
	}


	const clearTimer = (e) => {

		setTimer('00:60');
		if (Ref.current) clearInterval(Ref.current);
		const id = setInterval(() => {
			startTimer(e);
		}, 1000)
		Ref.current = id;
      
	}

	const getDeadTime = () => {
		let deadline = new Date();
		deadline.setSeconds(deadline.getSeconds() + 60);
		return deadline;
	}

	return (
		<div className="App">
			<span style={{fontSize:'12px'}}>{timer}</span>
		</div>
	)
})

export default Timer;
