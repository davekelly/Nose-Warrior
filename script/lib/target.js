
let Target = function(radius, x, y, livesFor, fillColour, isAlive)
{

	this.x = x;
	this.y = y;
    
    this.fillColour = (fillColour ? fillColour : 'steelblue');

	this.radius = (radius ? radius : 100);

    // not implemented yet - to add a 
    // lifespan timer to the targets
	this.livesFor = (livesFor ? livesFor : 10);

    this.isAlive = (typeof isAlive !== 'undefined'  ? isAlive : true);

	this.setup = function()
	{
        

	}

	this.update = function(beenAliveFor)
	{
		if(beenAliveFor >= this.livesFor){
            this.isAlive = false;
        }
	}


	this.display = function()
	{
        if(this.isAlive){
            stroke('#fff');
            fill( this.fillColour );
		    ellipse(this.x, this.y, this.radius * 2, this.radius * 2 );
        }
	}



	this.hasBeenHit = function( noseBullet)
	{
        if(! noseBullet){
            return;
        }

        // console.log(this, noseBullet);
        let d = dist(this.x, this.y, noseBullet.x, noseBullet.y);

        if(d <= (this.radius + noseBullet.radius) ){
            this.radius -= 5;
            this.cheer();

            // keep reducing the size until 
            // it's gone
            if(this.radius <= 0){
                this.isAlive = false;
            }else{
            
                let newLocation = this.getRandomLocation();
                this.x = newLocation.x;
                this.y = newLocation.y;
            }

            return true;
        }
        
        return false;

	}


    this.getRandomLocation = function()
    {        
        let min = Math.ceil(this.radius);
        let max = Math.floor(width);
        
        let x = Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
        
        min = Math.ceil(this.radius);
        max = Math.floor(height);
        
        y = Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive

        return {
            x: x, 
            y: y
        };            

    }

    this.cheer = function()
    {
        
        let index = Math.floor(random(0, game.soundEffectsLoaded.length));
        let cheer = game.soundEffectsLoaded[ index ];
        // console.log(game.soundEffectsLoaded, index, cheer);
        if (cheer.isPlaying()) {
            // .isPlaying() returns a boolean
            cheer.stop();   
        } else {
            cheer.play();            
        }
    }

}