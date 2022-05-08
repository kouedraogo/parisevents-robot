const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require("axios");
var cron = require('node-cron');
require('dotenv').config();

var mongoDbUrl = 'mongodb://superuser:motdepasse@127.0.0.1:27017'; //by default
//var mongoDbUrl = 'mongodb+srv://abelardo:abelardo@parisevents.y38fe.mongodb.net/Event_db?retryWrites=true&w=majority'
//var mongoDbUrl = 'mongodb+srv://process.env.MONGODB_USER:process.env.MONGODB_PSW@parisevents.y38fe.mongodb.net/Event_db?retryWrites=true&w=majority'

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
		mongoose.connection.dropCollection('events',function (err, doc) {
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
              //else
                //return console.log("Save event data successfully for " + Date.now());
            });
	}
  })
  .catch(function (error) {
    console.log(error);
  });

  // Schema mongoose simple pour chaque Events
  let scrappingSchema = new mongoose.Schema({

	localisation_link : String,
	pmr_access_link : String,
	deaf_access_link : String,
	blind_access_link : String,
	keyword_access_link : String,
	datestart_access_link : String,
	zipcode_access_link : String,
})
var Scrapping = mongoose.model('scrapping', scrappingSchema);

// drop existing database before refresh
mongoose.connection.dropCollection('scrappings',function (err, doc) {
	if (err) return console.error(err);
	else
	  return console.log("Collection scrappings successfully drop " + Date.now());
  });

var scrappingDataToSave = new Scrapping({

	localisation_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/map/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&basemap=jawg.dark&location=3,27.13737,1.40625&static=false&datasetcard=false&scrollWheelZoom=false',
	keyword_access_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/analyze/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&basemap=jawg.dark&location=11,48.84913,2.34695&dataChart=eyJxdWVyaWVzIjpbeyJjaGFydHMiOlt7InR5cGUiOiJjb2x1bW4iLCJmdW5jIjoiQ09VTlQiLCJ5QXhpcyI6InBtciIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiNGRkNEMDAifV0sInhBeGlzIjoidGFncyIsIm1heHBvaW50cyI6bnVsbCwidGltZXNjYWxlIjoiIiwic29ydCI6IiIsImNvbmZpZyI6eyJkYXRhc2V0IjoicXVlLWZhaXJlLWEtcGFyaXMtIiwib3B0aW9ucyI6eyJkaXNqdW5jdGl2ZS50YWdzIjp0cnVlLCJkaXNqdW5jdGl2ZS5hZGRyZXNzX25hbWUiOnRydWUsImRpc2p1bmN0aXZlLmFkZHJlc3NfemlwY29kZSI6dHJ1ZSwiZGlzanVuY3RpdmUuYWRkcmVzc19jaXR5Ijp0cnVlLCJkaXNqdW5jdGl2ZS5wbXIiOnRydWUsImRpc2p1bmN0aXZlLmJsaW5kIjp0cnVlLCJkaXNqdW5jdGl2ZS5kZWFmIjp0cnVlLCJkaXNqdW5jdGl2ZS50cmFuc3BvcnQiOnRydWUsImRpc2p1bmN0aXZlLnByaWNlX3R5cGUiOnRydWUsImRpc2p1bmN0aXZlLmFjY2Vzc190eXBlIjp0cnVlLCJkaXNqdW5jdGl2ZS5wcm9ncmFtcyI6dHJ1ZSwiYmFzZW1hcCI6Imphd2cuZGFyayIsImxvY2F0aW9uIjoiMywyNy4wNzI5OSwxLjM5NCJ9fX1dLCJkaXNwbGF5TGVnZW5kIjp0cnVlLCJhbGlnbk1vbnRoIjp0cnVlLCJ0aW1lc2NhbGUiOiIifQ%3D%3D&static=false&datasetcard=false',
	datestart_access_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/analyze/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&basemap=jawg.dark&location=11,48.84913,2.34695&dataChart=eyJxdWVyaWVzIjpbeyJjaGFydHMiOlt7InR5cGUiOiJjb2x1bW4iLCJmdW5jIjoiQ09VTlQiLCJ5QXhpcyI6InBtciIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiNGRkNEMDAifV0sInhBeGlzIjoiZGF0ZV9zdGFydCIsIm1heHBvaW50cyI6bnVsbCwidGltZXNjYWxlIjoiZGF5Iiwic29ydCI6IiIsImNvbmZpZyI6eyJkYXRhc2V0IjoicXVlLWZhaXJlLWEtcGFyaXMtIiwib3B0aW9ucyI6eyJkaXNqdW5jdGl2ZS50YWdzIjp0cnVlLCJkaXNqdW5jdGl2ZS5hZGRyZXNzX25hbWUiOnRydWUsImRpc2p1bmN0aXZlLmFkZHJlc3NfemlwY29kZSI6dHJ1ZSwiZGlzanVuY3RpdmUuYWRkcmVzc19jaXR5Ijp0cnVlLCJkaXNqdW5jdGl2ZS5wbXIiOnRydWUsImRpc2p1bmN0aXZlLmJsaW5kIjp0cnVlLCJkaXNqdW5jdGl2ZS5kZWFmIjp0cnVlLCJkaXNqdW5jdGl2ZS50cmFuc3BvcnQiOnRydWUsImRpc2p1bmN0aXZlLnByaWNlX3R5cGUiOnRydWUsImRpc2p1bmN0aXZlLmFjY2Vzc190eXBlIjp0cnVlLCJkaXNqdW5jdGl2ZS5wcm9ncmFtcyI6dHJ1ZSwiYmFzZW1hcCI6Imphd2cuZGFyayIsImxvY2F0aW9uIjoiMywyNy4wNzI5OSwxLjM5NCJ9fX1dLCJkaXNwbGF5TGVnZW5kIjp0cnVlLCJhbGlnbk1vbnRoIjp0cnVlLCJ0aW1lc2NhbGUiOiIifQ%3D%3D&static=false&datasetcard=false',
	zipcode_access_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/analyze/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&dataChart=eyJxdWVyaWVzIjpbeyJjaGFydHMiOlt7InR5cGUiOiJjb2x1bW4iLCJmdW5jIjoiQ09VTlQiLCJ5QXhpcyI6InBtciIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiMwMDMzNjYiLCJwb3NpdGlvbiI6ImNlbnRlciJ9XSwieEF4aXMiOiJhZGRyZXNzX3ppcGNvZGUiLCJtYXhwb2ludHMiOm51bGwsInRpbWVzY2FsZSI6IiIsInNvcnQiOiIiLCJjb25maWciOnsiZGF0YXNldCI6InF1ZS1mYWlyZS1hLXBhcmlzLSIsIm9wdGlvbnMiOnsiZGlzanVuY3RpdmUudGFncyI6dHJ1ZSwiZGlzanVuY3RpdmUuYWRkcmVzc19uYW1lIjp0cnVlLCJkaXNqdW5jdGl2ZS5hZGRyZXNzX3ppcGNvZGUiOnRydWUsImRpc2p1bmN0aXZlLmFkZHJlc3NfY2l0eSI6dHJ1ZSwiZGlzanVuY3RpdmUucG1yIjp0cnVlLCJkaXNqdW5jdGl2ZS5ibGluZCI6dHJ1ZSwiZGlzanVuY3RpdmUuZGVhZiI6dHJ1ZSwiZGlzanVuY3RpdmUudHJhbnNwb3J0Ijp0cnVlLCJkaXNqdW5jdGl2ZS5wcmljZV90eXBlIjp0cnVlLCJkaXNqdW5jdGl2ZS5hY2Nlc3NfdHlwZSI6dHJ1ZSwiZGlzanVuY3RpdmUucHJvZ3JhbXMiOnRydWUsImJhc2VtYXAiOiJqYXdnLmRhcmsiLCJsb2NhdGlvbiI6IjExLDQ4Ljg0OTEzLDIuMzQ2OTUifX0sInNlcmllc0JyZWFrZG93biI6IiIsInNlcmllc0JyZWFrZG93blRpbWVzY2FsZSI6IiJ9XSwiZGlzcGxheUxlZ2VuZCI6dHJ1ZSwiYWxpZ25Nb250aCI6dHJ1ZSwidGltZXNjYWxlIjoiIn0%3D&basemap=jawg.dark&location=11,48.84913,2.34695&static=false&datasetcard=false',
	pmr_access_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/analyze/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&dataChart=eyJxdWVyaWVzIjpbeyJjaGFydHMiOlt7InR5cGUiOiJwaWUiLCJmdW5jIjoiQ09VTlQiLCJ5QXhpcyI6InBtciIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6InJhbmdlLWN1c3RvbSIsInBvc2l0aW9uIjoiY2VudGVyIn1dLCJ4QXhpcyI6InBtciIsIm1heHBvaW50cyI6bnVsbCwidGltZXNjYWxlIjoiIiwic29ydCI6IiIsImNvbmZpZyI6eyJkYXRhc2V0IjoicXVlLWZhaXJlLWEtcGFyaXMtIiwib3B0aW9ucyI6eyJkaXNqdW5jdGl2ZS50YWdzIjp0cnVlLCJkaXNqdW5jdGl2ZS5hZGRyZXNzX25hbWUiOnRydWUsImRpc2p1bmN0aXZlLmFkZHJlc3NfemlwY29kZSI6dHJ1ZSwiZGlzanVuY3RpdmUuYWRkcmVzc19jaXR5Ijp0cnVlLCJkaXNqdW5jdGl2ZS5wbXIiOnRydWUsImRpc2p1bmN0aXZlLmJsaW5kIjp0cnVlLCJkaXNqdW5jdGl2ZS5kZWFmIjp0cnVlLCJkaXNqdW5jdGl2ZS50cmFuc3BvcnQiOnRydWUsImRpc2p1bmN0aXZlLnByaWNlX3R5cGUiOnRydWUsImRpc2p1bmN0aXZlLmFjY2Vzc190eXBlIjp0cnVlLCJkaXNqdW5jdGl2ZS5wcm9ncmFtcyI6dHJ1ZSwiYmFzZW1hcCI6Imphd2cuZGFyayIsImxvY2F0aW9uIjoiMTEsNDguODQ5MTMsMi4zNDY5NSJ9fSwic2VyaWVzQnJlYWtkb3duIjoiIiwic2VyaWVzQnJlYWtkb3duVGltZXNjYWxlIjoiIn1dLCJkaXNwbGF5TGVnZW5kIjp0cnVlLCJhbGlnbk1vbnRoIjp0cnVlLCJ0aW1lc2NhbGUiOiIifQ%3D%3D&basemap=jawg.dark&location=11,48.84913,2.34695&static=false&datasetcard=false',
	deaf_access_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/analyze/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&dataChart=eyJxdWVyaWVzIjpbeyJjaGFydHMiOlt7InR5cGUiOiJwaWUiLCJmdW5jIjoiQ09VTlQiLCJ5QXhpcyI6InBtciIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6InJhbmdlLWN1c3RvbSIsInBvc2l0aW9uIjoiY2VudGVyIn1dLCJ4QXhpcyI6ImRlYWYiLCJtYXhwb2ludHMiOm51bGwsInRpbWVzY2FsZSI6IiIsInNvcnQiOiIiLCJjb25maWciOnsiZGF0YXNldCI6InF1ZS1mYWlyZS1hLXBhcmlzLSIsIm9wdGlvbnMiOnsiZGlzanVuY3RpdmUudGFncyI6dHJ1ZSwiZGlzanVuY3RpdmUuYWRkcmVzc19uYW1lIjp0cnVlLCJkaXNqdW5jdGl2ZS5hZGRyZXNzX3ppcGNvZGUiOnRydWUsImRpc2p1bmN0aXZlLmFkZHJlc3NfY2l0eSI6dHJ1ZSwiZGlzanVuY3RpdmUucG1yIjp0cnVlLCJkaXNqdW5jdGl2ZS5ibGluZCI6dHJ1ZSwiZGlzanVuY3RpdmUuZGVhZiI6dHJ1ZSwiZGlzanVuY3RpdmUudHJhbnNwb3J0Ijp0cnVlLCJkaXNqdW5jdGl2ZS5wcmljZV90eXBlIjp0cnVlLCJkaXNqdW5jdGl2ZS5hY2Nlc3NfdHlwZSI6dHJ1ZSwiZGlzanVuY3RpdmUucHJvZ3JhbXMiOnRydWUsImJhc2VtYXAiOiJqYXdnLmRhcmsiLCJsb2NhdGlvbiI6IjExLDQ4Ljg0OTEzLDIuMzQ2OTUifX0sInNlcmllc0JyZWFrZG93biI6IiIsInNlcmllc0JyZWFrZG93blRpbWVzY2FsZSI6IiJ9XSwiZGlzcGxheUxlZ2VuZCI6dHJ1ZSwiYWxpZ25Nb250aCI6dHJ1ZSwidGltZXNjYWxlIjoiIn0%3D&basemap=jawg.dark&location=11,48.84913,2.34695&static=false&datasetcard=false',
	blind_access_link : 'https://opendata.paris.fr/explore/embed/dataset/que-faire-a-paris-/analyze/?disjunctive.tags&disjunctive.address_name&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.pmr&disjunctive.blind&disjunctive.deaf&disjunctive.transport&disjunctive.price_type&disjunctive.access_type&disjunctive.programs&dataChart=eyJxdWVyaWVzIjpbeyJjaGFydHMiOlt7InR5cGUiOiJwaWUiLCJmdW5jIjoiQ09VTlQiLCJ5QXhpcyI6InBtciIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6InJhbmdlLWN1c3RvbSIsInBvc2l0aW9uIjoiY2VudGVyIn1dLCJ4QXhpcyI6ImJsaW5kIiwibWF4cG9pbnRzIjpudWxsLCJ0aW1lc2NhbGUiOiIiLCJzb3J0IjoiIiwiY29uZmlnIjp7ImRhdGFzZXQiOiJxdWUtZmFpcmUtYS1wYXJpcy0iLCJvcHRpb25zIjp7ImRpc2p1bmN0aXZlLnRhZ3MiOnRydWUsImRpc2p1bmN0aXZlLmFkZHJlc3NfbmFtZSI6dHJ1ZSwiZGlzanVuY3RpdmUuYWRkcmVzc196aXBjb2RlIjp0cnVlLCJkaXNqdW5jdGl2ZS5hZGRyZXNzX2NpdHkiOnRydWUsImRpc2p1bmN0aXZlLnBtciI6dHJ1ZSwiZGlzanVuY3RpdmUuYmxpbmQiOnRydWUsImRpc2p1bmN0aXZlLmRlYWYiOnRydWUsImRpc2p1bmN0aXZlLnRyYW5zcG9ydCI6dHJ1ZSwiZGlzanVuY3RpdmUucHJpY2VfdHlwZSI6dHJ1ZSwiZGlzanVuY3RpdmUuYWNjZXNzX3R5cGUiOnRydWUsImRpc2p1bmN0aXZlLnByb2dyYW1zIjp0cnVlLCJiYXNlbWFwIjoiamF3Zy5kYXJrIiwibG9jYXRpb24iOiIxMSw0OC44NDkxMywyLjM0Njk1In19LCJzZXJpZXNCcmVha2Rvd24iOiIiLCJzZXJpZXNCcmVha2Rvd25UaW1lc2NhbGUiOiIifV0sImRpc3BsYXlMZWdlbmQiOnRydWUsImFsaWduTW9udGgiOnRydWUsInRpbWVzY2FsZSI6IiJ9&basemap=jawg.dark&location=11,48.84913,2.34695&static=false&datasetcard=false'

});
//save data
scrappingDataToSave.save(function (err, doc) {
  if (err) return console.error(err);
  else
	return console.log("Save scrapping data successfully for " + Date.now());
});

