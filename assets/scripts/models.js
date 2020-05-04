let app = new Vue({
    el: '#app',
    data: {
        movieDB: [],
    },
    async created() {
        const getMovieDB = async () => {
            const {data} = await axios.get('/getMovieDB');
            this.movieDB = data;
        };
        await getMovieDB();
        this.chartMovieDB();
    },
    methods: {
        getSeries() {
            // Makes a new array with a length of 20 that is filled with 0
            let aggregated = new Array(20).fill(0);
            this.movieDB.map(movie => {
                const {genres: {genreNumArray}} = movie;
                genreNumArray.map((val, index) => {
                    aggregated[index] += val;
                })
            })
            return aggregated;
        },
        chartMovieDB() {
            const data = {
                labels: Object.keys(this.movieDB[0]["genres"]["genres"]),
                series: [
                    this.getSeries(),
                ]
            }
            const options = {
                width: 1200,
                height: 300,
            }
            //console.log(this.getSeries());
            new Chartist.Bar('.ct-chart', data, options)
        },
    },
})
