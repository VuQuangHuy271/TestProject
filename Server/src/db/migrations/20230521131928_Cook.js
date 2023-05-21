exports.up = function(knex) {
    return knex.schema.createTable('Cook', table => {
        table.increments('Id');
        table.string('Ten');
        table.string('MoTa', 1000);
        table.string('Anh_Url');

        table.timestamp('CreatedDate').defaultTo(knex.fn.now());
        table.integer('CreatedBy');
        table.timestamp('UpdatedDate');
        table.integer('UpdatedBy');

    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Cook');
};
