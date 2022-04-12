import ImageGallery from "react-image-gallery";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PreviewBanner = (props) => {
  console.log("image props->", props.images);
  const data = [
    {
      original:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg",
    },
    {
      original:
        "https://cdn.britannica.com/s:800x450,c:crop/35/204435-138-2F2B745A/Time-lapse-hyper-lapse-Isle-Skye-Scotland.jpg",
      thumbnail:
        "https://cdn.britannica.com/s:800x450,c:crop/35/204435-138-2F2B745A/Time-lapse-hyper-lapse-Isle-Skye-Scotland.jpg",
    },

    {
      original: "https://static2.tripoto.com/media/filter/tst/img/735873/TripDocument/1537686560_1537686557954.jpg",
      thumbnail: "https://static2.tripoto.com/media/filter/tst/img/735873/TripDocument/1537686560_1537686557954.jpg",
    },

    {
      original:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Palace_of_Fine_Arts_%2816794p%29.jpg/1200px-Palace_of_Fine_Arts_%2816794p%29.jpg",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Palace_of_Fine_Arts_%2816794p%29.jpg/1200px-Palace_of_Fine_Arts_%2816794p%29.jpg",
    },

    {
      original: "https://i.natgeofe.com/n/f7732389-a045-402c-bf39-cb4eda39e786/scotland_travel_4x3.jpg",
      thumbnail: "https://i.natgeofe.com/n/f7732389-a045-402c-bf39-cb4eda39e786/scotland_travel_4x3.jpg",
    },
  ];

  const hotels = {
    name: props.name,
    city: props.city,
    rating: props.rating,
    star: props.star,
    images: props.images,
  };

  const starsymbol = "★";
  const totalStar = starsymbol.repeat(hotels.star);

  return (
    <section className="previewbanner">
      <div className="previewbanner__heading">
        {(hotels.name) ?(
          <>
            <h5>{hotels.name}</h5>
          </>
        ):(<h5 style={{width:"40%"}}><Skeleton  /> </h5>)}
        
        <div className="hotelbooking__star">
        {(hotels.name) ?(
          <>
              <h6 style={{ fontWeight: 400 }}>{hotels.city}</h6>
              <span>{totalStar}</span>

              {/* use bad, avg and good for rating parameter as classname */}
              {hotels.rating > 0 ? (
                <span
                  className={
                    hotels.rating > 3.5
                      ? "rating good"
                      : hotels.rating > 2.5 && hotels.rating <= 3.5
                      ? "rating avg"
                      : "rating bad"
                  }
                >
                  {hotels.rating} / 5
                </span>
              ) : (
                ""
              )}
          </>
        ):(<h6 style={{width:"40%"}}><Skeleton  /> </h6>)}
        
        </div>
      </div>

      <div className="previewbanner__preview">
        <div style={{}}>
          <ImageGallery
            items={
              props.images?.map((img) => {
                img = img.replace("http://", "https://");
                
                let orgImg=img;
                
                if(orgImg.includes('photos.hotelbeds')){
                  orgImg = orgImg.replace("/giata", "/giata/bigger")
                }
                
                return {
                  original: orgImg,
                  thumbnail: img,
                };
              }) || []
            }
            showNav={false}
            showPlayButton={false}
            autoPlay={true}
            showIndex={true}
            showFullscreenButton={false}
          />
        </div>

        {/* <div className="previewbanner__bigimg">
          <img src="/images/demo-img3.jpg" alt="img" />
        </div>
        <div className="previewbanner__thumbnils">
          <div className="previewbanner__thumbnils__img">
            <img src="/images/gallery2.png" alt="img1" />
          </div>
          <div className="previewbanner__thumbnils__img active">
            <img src="/images/gallery2.png" alt="img1" />
          </div>
          <div className="previewbanner__thumbnils__img">
            <img src="/images/gallery2.png" alt="img1" />
          </div>
          <div className="previewbanner__thumbnils__img">
            <img src="/images/gallery2.png" alt="img1" />
          </div>
          <div className="previewbanner__thumbnils__img">
            <img src="/images/gallery2.png" alt="img1" />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default PreviewBanner;
