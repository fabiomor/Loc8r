/*
Queries to be executed to populate Loc8r db directly through mongo console interface
*/

db.locations.save({
	name: 'Starcups',
	address: '125 High Street, Reading, RG6 1PS',
	rating: 3,
	facilities: ['Hot drinks', 'Food', 'Premium wifi'],
	"2dsphereIndexVersion": 1,
	coords: [-0.9690884, 51.455041],
	openingTimes: [{
		days: 'Monday - Friday',
		opening: '7:00am',
		closing: '7:00pm',
		closed: false
	}, {
		days: 'Saturday',
		opening: '8:00am',
		closing: '5:00pm',
		closed: false
	}, {
		days: 'Sunday',
		closed: true
	}]
});

// update for reviews 
db.locations.update({
	name: 'Starcups'
	}, {
	$push: {
		reviews: {
			author: 'Simon Holmes',
			_id: ObjectId(),
			rating: 5,
			timestamp: new Date("Jul 16, 2013"),
			reviewText: "What a great place. I can't say enough good things about it."
		}
	}
});

// review 2
db.locations.update({
	name: 'Starcups'
	}, {
	$push: {
		reviews: {
			author: 'Santa Claus',
			_id: ObjectId(),
			rating: 4,
			timestamp: new Date("Dec 24, 2000"),
			reviewText: "Nice place. I wish the fireplace was bigger."
		}
	}
});



// second location
db.locations.save({
	name: 'McDonalds',
	address: 'Piazza Verdi, Viterbo, Italy',
	rating: 3,
	facilities: ['Hot drinks', 'Food', 'Premium wifi'],
	"2dsphereIndexVersion": 1,
	coords: [12.1076690, 42.4206770],
	openingTimes: [{
		days: 'Monday - Friday',
		opening: '7:00am',
		closing: '7:00pm',
		closed: false
	}, {
		days: 'Saturday',
		opening: '8:00am',
		closing: '5:00pm',
		closed: false
	}, {
		days: 'Sunday',
		closed: true
	}],
	reviews: {
		author: 'Gasperino',
		_id: ObjectId(),
		rating: 5,
		timestamp: new Date("Jan 1, 2015"),
		reviewText: "Let's eat everything!!."
	}
});

// third location
db.locations.save({
	name: 'Burger Queen',
	address: 'Via Celio Vibenna, Roma, Italy',
	rating: 3,
	facilities: ['Hot drinks', 'Food', 'Premium wifi'],
	"2dsphereIndexVersion": 1,
	coords: [12.4914610, 41.8891470],
	openingTimes: [{
		days: 'Monday - Friday',
		opening: '7:00am',
		closing: '7:00pm',
		closed: false
	}, {
		days: 'Saturday',
		opening: '8:00am',
		closing: '5:00pm',
		closed: false
	}, {
		days: 'Sunday',
		closed: true
	}],
	reviews: {
		author: 'Giulio Cesare',
		_id: ObjectId(),
		rating: 5,
		timestamp: new Date("Jul 16, 2000"),
		reviewText: "Best Place in the world!."
	}
});


// fourth location
db.locations.save({
        name: 'Burger Queen2',
        address: 'Via Celio Vibenna, Roma, Italy',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        "2dsphereIndexVersion": 1,
        coords: [12.4914610, 41.8891470],
        openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
        }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
        }, {
                days: 'Sunday',
                closed: true
        }],
        reviews: {
                author: 'Giulio Cesare',
                _id: ObjectId(),
                rating: 5,
                timestamp: new Date("Jul 16, 2000"),
                reviewText: "Best Place in the world!."
        }
});


