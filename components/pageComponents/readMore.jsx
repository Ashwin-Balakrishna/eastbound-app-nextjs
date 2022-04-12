import React, { useState } from "react";

const ReadMore = ({ cities }) => {
	const [readMore, setReadMore] = useState(false);
	const cityName = cities.map(city => city.travel_packages_city_name);
  return (
		<>
			{readMore ? (
				<p className="text-xs mb-1">
					{cityName.join()}
				</p>
			) : (
				<p className="text-xs mb-1">
					{cityName.slice(0,2).join()}
					&nbsp;
					{cityName.length > 2 ? (
						<a href="#0" onClick={() => setReadMore(true)}>+{cities.length - 2} more</a>
					) : null}
				</p>
			)}
		</>
  );
};

export default ReadMore;
