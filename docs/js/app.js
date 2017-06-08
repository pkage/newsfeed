app = new Vue({
	el: '#app',
	data: {
		articles: [],
		sources: [],
		api_key: null,
		max_pool_size: 100,
		showing: {url: ""}
	},
	mounted: function() {
		// get the configuration
		fetch('assets/news.json')
			.then(r => r.json())
			.then(r => {
				this.api_key = r.api_key;
				this.sources = r.sources;
				this.getArticles();

				// hide the loading selector
				document.querySelector('.loading').style.display = 'none';
				
				// set up intervals
				setInterval(this.showArticle.bind(this), 1000 * 30); // every 30sec
				setInterval(this.getArticles.bind(this), 1000 * 60 * 2); // every 2min
			});
	},
	methods: {
		getArticles: function(source) {
			// if a source was not provided pick one at random
			if (source === undefined) {
				source = this.sources[Math.floor(Math.random() * this.sources.length)];
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

					this.lifeguard();
					this.showArticle();
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
		},
		lifeguard: function() {
			// remove the oldest articles to ensure a fresh feed
			while (this.articles.length > this.max_pool_size) {
				this.removeOldestArticle();
			}
		},
		showArticle: function() {
			this.showing = this.articles[Math.floor(Math.random() * this.articles.length)];
			document.querySelector('.background-image').style.backgroundImage = `url(${this.showing.urlToImage})`;
		},
		formatSource: function(source) {
			if (source != undefined) {
				return source.replace(/\-/g, ' ');
			}
		},
		formatLines: function(text, charlen) {
			if (text === undefined || text === null) return;
			// split the description into lines
			var lines = [];
			var desc = text.split(' ');
			var line = "";

			for (let word of desc) {
				line += word;
				if (line.length > charlen) {
					lines.push(line);
					line = "";
				} else {
					line += ' ';
				}
			}
			lines.push(line);

			return lines;
		}
	}
});
