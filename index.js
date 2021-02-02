//importing files and shit that i need
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const {google} = require('googleapis');
const keys = require('./keys.json');

//variable gclient is our google client for actually doing things on a spreadsheet
const gclient = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);


//attempts to connect to goog, if it does, runs function gsrun which is where things actually happen
gclient.authorize(function(err,tokens){
    
    if(err) {
        console.log(err);
        return;
    } else {
        console.log('connected to goog!');
        gsrun(gclient);
    }
});

//asynchronous function that takes in client, and does things
async function gsrun(cl){

    //i think this is just to specify what api im using?
    const gsapi = google.sheets({version:'v4', auth:cl});

    //whenever we run one of the google sheets functions, you have to put in some options, and you can store that as a variable here just to make things easier
    const opt = {
        spreadsheetId: '1nTABNSFsGzwzLlEdNftxMXjJ9oSHyoKbenj8GJdClno',
        range: 'Sheet1!A2:B5'
    };

    //bulk has ALL data from that range, not just the values in cells. uncomment the log below to see what i mean
    let bulk = await gsapi.spreadsheets.values.get(opt);
    //console.log(bulk);

    //bulkArray here is getting the actual cell data, which is what we care about.
    let bulkArray = bulk.data.values;
    

    //these are a different set of options for actually writing things to the sheet
    //if you look at range and resource, you can see we're just taking the stuff that was read from the sheet and printing it slightly to the right
    const updateOpt = {
        spreadsheetId: '1nTABNSFsGzwzLlEdNftxMXjJ9oSHyoKbenj8GJdClno',
        range: 'Sheet1!E2',
        valueInputOption: 'USER_ENTERED',
        resource: {values: bulkArray}

    };

    //actually executing the options above
    let res = await gsapi.spreadsheets.values.update(updateOpt);


}



//everything past here is just discord stuff
const prefix = config.prefix;

client.once('ready', () => {
    console.log('connected to discord!');


});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'butt') {
        message.channel.send('ass!');
    }

});


client.login(config.token);