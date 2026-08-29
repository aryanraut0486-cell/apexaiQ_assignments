function ResultsTable({
  results
}) {

  return (

    <section className="card results-card">

      <div className="section-title">

        <div>

          <h2>
            Website Health Results
          </h2>

          <p>
            Latest monitoring results
          </p>

        </div>


        <span className="result-count">

          {results.length} Websites

        </span>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Website</th>

              <th>Status</th>

              <th>Response Time</th>

              <th>Availability</th>

              <th>SSL</th>

              <th>Page Title</th>

            </tr>

          </thead>


          <tbody>

            {results.map((result) => (

              <tr key={result.id}>

                <td className="website-url">

                  {result.url}

                </td>


                <td>

                  <span className="status-code">

                    {result.status}

                  </span>

                </td>


                <td>

                  {result.responseTime} ms

                </td>


                <td>

                  <span
                    className={
                      result.availability === "UP"
                        ? "badge success"
                        : "badge danger"
                    }
                  >

                    {result.availability}

                  </span>

                </td>


                <td>

                  <span
                    className={
                      result.ssl === "Valid"
                        ? "badge success"
                        : "badge warning"
                    }
                  >

                    {result.ssl}

                  </span>

                </td>


                <td>

                  {result.title}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}


export default ResultsTable;