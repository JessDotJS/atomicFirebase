/**
 * Created by Computadora on 08-Jan-17.
 */
'use strict';

var $afArray = function(ref, schema){
    this.ref = ref;
    this.schema = schema;
    this.server = new Server(ref);
};



$afArray.prototype.$on = function(afArrayObject){
    var self = this;
    self.id = 0;

    if(afArrayObject != undefined){
        self.arrayRef = afArrayObject.ref || self.ref.primary;
        self.query = {
            initialLotSize: afArrayObject.initialLotSize || 10,
            nextLotSize: afArrayObject.nextLotSize || 12
        };
    }else{
        self.arrayRef = self.ref.primary;
        self.query = {
            initialLotSize: 10,
            nextLotSize: 12
        };
    }

    self.eventListenerRef = null;
    self.displayedItems = 0;
    self.subscribed = false;
    self.initialLotLoaded = false;
    self.itemsRemaining = true;
    self.fetching = false;
    self.items = [];

    self.get = {
        items: function(){
            return self.items;
        }
    };

    return new Promise(function(resolve, reject){
        self.loadInitialLot().then(function(instanceID){
            resolve(instanceID);
        }).catch(function(err){reject(err)});
    });

};




/*
* Content Loaders
* */
$afArray.prototype.loadInitialLot = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        var initialLotRef = self.ref.root.child(self.arrayRef).limitToFirst(self.query.initialLotSize);
        initialLotRef
            .once("value")
            .then(function(initialLotItemsSnapshot){
                self.server.updateTS().then(function(){
                    self.server.getTS().then(function(serverTS){
                        initialLotItemsSnapshot.forEach(function(item){
                            self.addItem(item, false);
                        });
                        self.eventListenerRef = self.ref.root.child(self.arrayRef).orderByChild('latestServerTS').startAt(serverTS);
                        self.id = serverTS;
                        self.initialLotLoaded = true;
                        self.subscribe();
                        document.dispatchEvent(new Event(self.id + '-initialLotLoaded'));
                        resolve(self.id);
                    }).catch(function(err){reject(err)});
                }).catch(function(err){reject(err)});
        });
    });
};


$afArray.prototype.loadNextLot = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        if(!self.fetching && self.items[parseInt(self.displayedItems) - 1] != undefined){
            self.fetching = true;
            var previousArrayLength = self.items.length;
            var nextLotRef =
                self.ref.root.child(self.arrayRef).startAt(self.items[parseInt(self.displayedItems) - 1].$priority + 1)
                    .limitToFirst(self.query.nextLotSize);
            nextLotRef.once("value").then(function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    self.addItem(childSnapshot, false);
                });
                if(previousArrayLength == self.items.length){
                    self.itemsRemaining = false;
                }
                setTimeout(function(){
                    self.fetching = false;
                    resolve(true);
                }, 5000);
            }).catch(function(err){
                reject(err);
            });
        }else{
            setTimeout(function(){  resolve(false) }, 2000);
        }
    });

};


/*
 * Event Listeners Subscriber
 * */


$afArray.prototype.subscribe = function(){
    var self = this;
    self.subscribed = true;
    self.eventListenerRef.on('child_added', function(snapshot) {
        console.log('child_added');
        self.addItem(snapshot, true);
    });

    self.eventListenerRef.on('child_changed', function(snapshot) {
        console.log('child_changed');
        self.editItem(snapshot);
    });

    self.eventListenerRef.on('child_moved', function(snapshot) {
        console.log('child_moved');
        self.editItem(snapshot);
    });

    self.eventListenerRef.on('child_removed', function(snapshot) {
        console.log('child_removed');
        self.removeItem(snapshot);
    });
    console.log('Instance: ' + self.id + ' subscribed.');
};


/*
 * Deactivators
 * */

$afArray.prototype.deactivate = function(){
    this.unsubscribe();
    this.resetDefaults();
};

$afArray.prototype.unsubscribe = function(){
    var self = this;
    if(self.subscribed){
        self.eventListenerRef.off('child_added');
        self.eventListenerRef.off('child_changed');
        self.eventListenerRef.off('child_moved');
        self.eventListenerRef.off('child_removed');
        self.subscribed = false;
        console.log('Instance: ' + this.id + ' unsubscribed.');
    }
};

$afArray.prototype.resetDefaults = function(){
    this.arrayRef = null;
    this.query = null;
    this.eventListenerRef = null;
    this.displayedItems = 0;
    this.subscribed = false;
    this.initialLotLoaded = false;
    this.itemsRemaining = true;
    this.fetching = false;
    this.items = [];
};


/*
* Item Handlers
* */

$afArray.prototype.addItem = function(snapshot, isNew){
    var self = this;
    if(!self.itemExists(snapshot)){
        var afObject = self.schema.build(snapshot, 'snapshot');
        if(isNew)afObject.isNew = true;
        self.items.push(afObject);
        self.displayedItems += 1;
    }
};

$afArray.prototype.editItem = function(snapshot){
    var self = this;
    var afObject = self.schema.build(snapshot, 'snapshot');
    for(var i = 0; i < self.items.length; i++){
        if(self.items[i].$key == afObject.$key){
            self.items[i] = afObject;
        }
    }
};

$afArray.prototype.removeItem = function(snapshot){
    var self = this;
    for(var i = 0; i < self.items.length; i++){
        if(self.items[i].$key == snapshot.key){
            self.items.splice(i, 1);
            self.displayedItems -= 1;
        }
    }
};


$afArray.prototype.itemExists = function(snapshot){
    var self = this;
    var exists = false;
    for(var i = 0; i < self.items.length; i++){
        if(self.items[i].$key == snapshot.key){
            exists = true;
        }
    }
    return exists;
};