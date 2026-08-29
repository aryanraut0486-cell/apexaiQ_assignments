import { useState } from "react";


function UrlInput({
  onMonitor,
  loading
}) {

  const [urls, setUrls] = useState(
    "https://google.com\nhttps://github.com\nhttps://python.org"
  );


  const handleSubmit = (event) => {

    event.preventDefault();


    const urlList = urls
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);


    if (urlList.length === 0) {

      alert(
        "Please enter at least one website URL."
      );

      return;

    }


    if (urlList.length > 100) {

      alert(
        "Maximum 100 websites are allowed."
      );

      return;

    }


    onMonitor(urlList);

  };


  return (

    <section className="card input-card">

      <div className="section-title">

        <div>

          <h2>
            Monitor Websites
          </h2>

          <p>
            Enter one website URL per line
          </p>

        </div>

        <span className="url-limit">
          Maximum 100
        </span>

      </div>


      <form onSubmit={handleSubmit}>

        <textarea

          value={urls}

          onChange={(event) =>
            setUrls(event.target.value)
          }

          placeholder={
            "https://google.com\n" +
            "https://github.com\n" +
            "https://example.com"
          }

          rows="8"

        />


        <div className="input-footer">

          <span>

            {urls
              .split("\n")
              .filter(url =>
                url.trim() !== ""
              ).length
            } websites

          </span>


          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >

            {loading
              ? "Monitoring..."
              : "Start Monitoring"
            }

          </button>

        </div>

      </form>

    </section>

  );

}


export default UrlInput;