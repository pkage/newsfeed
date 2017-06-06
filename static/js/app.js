app = new Vue({
	el: '#app',
	data: {
		articles: [],
		sources: [],
		api_key: null,
		max_pool_size: 100
	},
	mounted: function() {
		// get the configuration
		fetch('assets/news.json')
			.then(r => r.json())
			.then(r => {
				this.api_key = r.api_key;
				this.sources = r.sources;
				this.getArticles();
			});
	},
	methods: {
		getArticles: function(source) {
			// if a source was not provided pick one at random
			if (source === undefined) {
				source = this.sources[Math.floor(Math.random() * this.articles.length)];
			}

			// make the api call
			fetch(`https://newsapi.org/v1/articles?source=${source}&sortBy=top&apiKey=${this.api_key}`)
				.then(r => r.json())
				.then(r => {
					for (article of r.articles) {
						article.source = r.source;
						article.publishedAt = new Date(article.publishedAt);
						this.articles.push(article);
					}
				});
		},
		removeOldestArticle: function() {
			// oldest date is the current date
			var oldestDate = new Date();
			var oldestIndex = 0;

			// iterate over the array
			for (let index in this.articles) {
				// if this index is older than the oldest previously seen
				if (oldestDate > this.articles[index].publishedAt) {
					oldestIndex = index;
					oldestDate = this.articles[index].publishedAt;
				}
			}
			
			// and splice it out
			console.log('removing index ' + oldestIndex);
			this.articles.splice(oldestIndex, 1);
		}
	}
});
