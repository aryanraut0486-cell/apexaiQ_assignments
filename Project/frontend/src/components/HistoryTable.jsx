function HistoryTable({
  history
}) {

  return (

    <section className="card history-card">

      <div className="section-title">

        <div>

          <h2>
            Monitoring History
          </h2>

          <p>
            Previous performance comparisons
          </p>

        </div>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Run</th>

              <th>Sequential</th>

              <th>Concurrent</th>

              <th>Speedup</th>

              <th>Improvement</th>

            </tr>

          </thead>


          <tbody>

            {history.map((run) => (

              <tr key={run.id}>

                <td>

                  #{run.id}

                </td>

                <td>

                  {run.sequentialTime}s

                </td>

                <td>

                  {run.concurrentTime}s

                </td>

                <td>

                  <strong>

                    {run.speedup}x

                  </strong>

                </td>

                <td>

                  <span className="badge success">

                    {run.improvement}%

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}


export default HistoryTable;