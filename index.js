const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require("axios");
var cron = require('node-cron');

//var mongoDbUrl = 'mongodb://superuser:motdepasse@127.0.0.1:27017'; //by default
var mongoDbUrl = 'mongodb+srv://abelardo:abelardo@parisevents.y38fe.mongodb.net/Event_db?retryWrites=true&w=majority'

// Conncection à la bdd mongodb, via mongoose
//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true, dbName:'Event_db'})
//mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true, dbName:'Event_db'})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



// Schema mongoose simple pour chaque Events
  let eventSchema = new mongoose.Schema({
	//recordid : String,
	//id : String,
	access_link : String,
	access_link_text : String,
	access_type : String,
	address_city : String,
	address_name : String,
	address_street : String,
	address_text : String,
	address_url : String,
	address_url_text : String,
	address_zipcode : String,
	blind : Number,
	contact_facebook : String,
	contact_mail : String,
	contact_phone : String,
	contact_twitter : String,
	contact_url : String,
	cover_alt : String,
	cover_credit : String,
	cover_url : String,
	date_description : String,
	date_end : Date,
	date_start : Date,
	deaf : Number,
	description : String,
	//image_couverture : Object,
	lat_lon : Array,
	lead_text : String,
	occurrences : String,
	pmr : Number,
	price_detail : String,
	price_type : String,
	programs : String,
	tags : String,
	title : String,
	title_event : String,
	transport : String,
	updated_at : Date,
	url : String,
	//coordinates : Array,
	record_timestamp : String
  })
  var Event = mongoose.model('Event', eventSchema);

const api = "https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/download/?format=json&timezone=Europe/Berlin&lang=fr" ;
let dateNow = Date.now();


axios
  .get(api)
  .then((resp) => {
        console.log("Get que-faire-a-paris Events data successfull for " + dateNow);
		let respValue = resp.data;
		console.log(respValue.length);
        //console.log(respValue);

		// drop existing database before refresh
		mongoose.connection.db.dropCollection('events',function (err, doc) {
			if (err) return console.error(err);
			else
			  return console.log("Collection events successfully drop " + Date.now());
		  });
		
		//refresh database with Events data:
	//  for(events in respValue){
	for(let i=0; i<respValue.length; i++){
		
		var eventDataToSave = new Event({
			access_link : respValue[i].fields.access_link,
			access_link_text : respValue[i].fields.access_link_text,
			access_type : respValue[i].fields.access_type,
			address_city : respValue[i].fields.address_city,
			address_name : respValue[i].fields.address_name,
			address_street : respValue[i].fields.address_street,
			address_text : respValue[i].fields.address_text,
			address_url : respValue[i].fields.address_url,
			address_url_text : respValue[i].fields.address_url_text,
			address_zipcode : respValue[i].fields.address_zipcode,
			blind : respValue[i].fields.blind,
			contact_facebook : respValue[i].fields.contact_facebook,
			contact_mail : respValue[i].fields.contact_mail,
			contact_phone : respValue[i].fields.contact_phone,
			contact_twitter : respValue[i].fields.contact_twitter,
			contact_url : respValue[i].fields.contact_url,
			cover_alt : respValue[i].fields.cover_alt,
			cover_credit : respValue[i].fields.cover_credit,
			cover_url : respValue[i].fields.cover_url,
			date_description : respValue[i].fields.date_description,
			date_end : respValue[i].fields.date_end,
			date_start : respValue[i].fields.date_start,
			deaf : respValue[i].fields.deaf,
			description : respValue[i].fields.description,
			//image_couverture : respValue[i].fields.image_couverture,
			lat_lon : respValue[i].fields.lat_lon,
			lead_text : respValue[i].fields.lead_text,
			occurrences : respValue[i].fields.occurrences,
			pmr : respValue[i].fields.pmr,
			price_detail : respValue[i].fields.price_detail,
			price_type : respValue[i].fields.price_type,
			programs : respValue[i].fields.programs,
			tags : respValue[i].fields.tags,
			title : respValue[i].fields.title,
			title_event : respValue[i].fields.title_event,
			transport : respValue[i].fields.transport,
			updated_at : respValue[i].fields.updated_at,
			url : respValue[i].fields.url,
			//coordinates : respValue[i].geometry.coordinates,
			record_timestamp : respValue[i].record_timestamp
			});
            //console.log(JSON.stringify(eventDataToSave));
            eventDataToSave.save(function (err, doc) {
              if (err) return console.error(err);
              else
                return console.log("Save event data successfully for " + Date.now());
            });
	}

  })
  .catch(function (error) {
    console.log(error);
  });