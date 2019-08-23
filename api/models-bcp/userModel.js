'user strict';


module.exports = function (orm, db) {
    var User = db.define('user', {
        id: { type: 'integer' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
    });
    //Comment.hasOne("post", db.models.post);
};

