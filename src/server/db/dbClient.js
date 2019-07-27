const mongoose = require('mongoose');

class DbClient {
    constructor(model) {
        this.url = process.env.MONGODB_URI || 'mongodb://localhost:27017/organizer';
        this.model = model;
    }

    async connect() {
        await mongoose.connect(
            this.url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
            },
        );
    }

    async findAll(queries) {
        await this.connect();
        return this.model.find(queries);
    }

    async findOne(query) {
        await this.connect();
        return this.model.findOne(query);
    }

    async findById(id) {
        await this.connect();
        return this.model.findOne({ _id: id });
    }

    async update(id, params) {
        await this.connect();
        return this.model.findByIdAndUpdate(
            id,
            { $set: params },
            {
                new: true,
                runValidators: true,
            },
        );
    }

    async post(item) {
        await this.connect();
        return this.model.create(item);
    }

    async save(item) {
        await this.connect();
        return item.save();
    }

    async destroy(id) {
        await this.connect();
        return this.model.deleteOne({ _id: id });
    }

    async destroyAll() {
        await this.connect();
        return this.model.deleteMany({});
    }
}

module.exports = DbClient;
