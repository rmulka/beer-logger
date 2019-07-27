const { Types } = require('mongoose');

module.exports = () => ({
    name: 'sampleBeer',
    brewedBy: 'sampleBrewery',
    type: 'sampleType',
    ibu: 99,
    rating: 9,
    calories: 99,
    publisherId: Types.ObjectId(),
    comments: 'sampleComment',
});
