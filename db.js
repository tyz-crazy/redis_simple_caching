var redis = require("redis");
var bluebird = require('bluebird');
var schedule = require('node-schedule');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Constructor API class
function API()
{
    this.redisClient = redis.createClient();

    this.redisClient.on("error", function (err) 
    {
        log("Error create Redis client: " + err);
    });

    // When we first start, we need to process the remaining data in the database
    this.GetAllMsg();
};

// Add new message in DB
API.prototype.AddMsg = function( date, msg )
{
    var _self = this;

    this.redisClient.hset("messages", date, msg, function(error, value)
    {
        // Start a queue
        _self.EchoAtTime( date, msg );
    });
};

// Queue Handler
API.prototype.EchoAtTime = function( date, msg )
{
    var _self = this;

    var delay = date - Date.now();

    if ( delay && delay > 0 )
    {
        // Simple realization - SetTimeout
        /*setTimeout(function()
        {
            _self.DelMsg( date, msg );

        }, delay);*/

        // More practical option
        var job = schedule.scheduleJob(date, function()
        {
            _self.DelMsg( date, msg );
        });
    }
    else
    {
        _self.DelMsg( date, msg );
    };
    
};

// Delete and print message
API.prototype.DelMsg = function( date, msg )
{
    var _self = this;

    this.redisClient.hdel("messages", date, function(error, value)
    {
        if ( !error & value )
        {
            // Write to console
            log( "Сообщение выведено и удалено. Date: " + date + ". Message: " + msg );
        };
    });
};


// Get All messages from DB
API.prototype.GetAllMsg = function()
{
    var _self = this;

    this.redisClient.hgetall("messages", function (err, values) 
    {
        for( var date in  values)
        {
            // Start queue for each message
            _self.EchoAtTime( date, values[date] );
        };
        
    });
};


module.exports = API;
