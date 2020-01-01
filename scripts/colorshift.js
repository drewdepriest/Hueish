
function RGB2HSV(rgb) {
    var hsv = new Object();
    max = Math.max(rgb.r,rgb.g,rgb.b);
    min = Math.min(rgb.r,rgb.g,rgb.b);

    dif = max - min;

    if(max == 0){
        hsv.saturation = 0;
    }else{
        hsv.saturation = 100*dif/max;
    }
    
    if(hsv.saturation==0){
        hsv.hue=0;  
    } else if(rgb.r == max){
        hsv.hue=60.0*(rgb.g-rgb.b)/dif;  
    } else if (rgb.g == max){
        hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;  
    } else if (rgb.b == max){
        hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;  
    } 
    if(hsv.hue<0.0){
        hsv.hue+=360.0;  
    } 
    
    hsv.value = Math.round(max*100/255);
    hsv.hue = Math.round(hsv.hue);
    hsv.saturation = Math.round(hsv.saturation);
    return hsv;
}

function HSV2RGB(hsv) {
    var rgb=new Object();
    if (hsv.saturation == 0) {
    	rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
    } else {
    	hsv.hue/=60;
    	hsv.saturation/=100;
    	hsv.value/=100;
    	i=Math.floor(hsv.hue);
    	f=hsv.hue-i;
    	p=hsv.value*(1-hsv.saturation);
    	q=hsv.value*(1-hsv.saturation*f);
    	t=hsv.value*(1-hsv.saturation*(1-f));
    	
        switch(i) {
    	case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
    	case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
    	case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
    	case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
    	case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
    	default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
    	}
    	rgb.r=Math.round(rgb.r*255);
    	rgb.g=Math.round(rgb.g*255);
    	rgb.b=Math.round(rgb.b*255);
    }
    return rgb;
}
