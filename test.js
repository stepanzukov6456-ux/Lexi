import assert from 'node:assert/strict';import {empty,merge,review,parseCSV,valid} from './model.js';let a=empty(),b=empty();a.cards.x={id:'x',term:'word',tags:[],updated:1};b.cards.x={id:'x',deleted:true,updated:2};assert.equal(merge(a,b).cards.x.deleted,true);assert.equal(valid(a),true);assert.equal(review(a.cards.x,0,0).due,600000);assert.equal(review(a.cards.x,2,0).due,259200000);assert.deepEqual(parseCSV('term,definition\r\n"a,b","x"'),[['term','definition'],['a,b','x']]);console.log('OK');
import {parseChatCards} from './chat-import.js';
const sample={term:' take off ',definition:'взлетать',example:'The plane took off.',exampleTranslation:'Самолёт взлетел.',tags:['глагол','глагол']};
for(const input of [sample,[sample],{cards:[sample]}]){const result=parseChatCards(JSON.stringify(input));assert.equal(result[0].term,'take off');assert.deepEqual(result[0].tags,['глагол']);}
assert.equal(parseChatCards('```json\n'+JSON.stringify(sample)+'\n```').length,1);
for(const bad of ['bad','[]','null',JSON.stringify({...sample,tags:'x'}),JSON.stringify({cards:[sample,{term:'x'}]})])assert.throws(()=>parseChatCards(bad));
console.log('Chat import OK');
