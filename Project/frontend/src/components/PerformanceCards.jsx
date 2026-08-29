function PerformanceCards({
  performance
}) {

  return (

    <section>

      <h2 className="section-heading">
        Performance Comparison
      </h2>


      <div className="performance-grid">


        {/* Sequential */}

        <div className="performance-card">

          <span className="card-label">
            Sequential Time
          </span>

          <strong>
            {performance.sequentialTime}s
          </strong>

          <p>
            One website at a time
          </p>

        </div>


        {/* Concurrent */}

        <div className="performance-card">

          <span className="card-label">
            Concurrent Time
          </span>

          <strong>
            {performance.concurrentTime}s
          </strong>

          <p>
            Multiple websites simultaneously
          </p>

        </div>


        {/* Speedup */}

        <div className="performance-card">

          <span className="card-label">
            Speedup
          </span>

          <strong>
            {performance.speedup}x
          </strong>

          <p>
            Faster execution
          </p>

        </div>


        {/* Improvement */}

        <div className="performance-card">

          <span className="card-label">
            Improvement
          </span>

          <strong>
            {performance.improvement}%
          </strong>

          <p>
            Reduction in execution time
          </p>

        </div>


      </div>

    </section>

  );

}


export default PerformanceCards;