const divs = document.querySelectorAll('div.shader')

    

divs.forEach(div => {
  const img = div.querySelector('img')

  imagesLoaded(img, function() {
    const canvas = document.createElement('canvas')
    const sandbox = new GlslCanvas(canvas)
    div.append(canvas)
    div.classList.add('loaded')

    const sizer = () => {
      const w = img.clientWidth + 200
      const h = img.clientHeight + 200
      const dpi = window.devicePixelRatio

      canvas.width = w * dpi
      canvas.height = h * dpi
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      
      sandbox.setUniform("dpi, dpi")
    }
    
    let currentStrength = 1; 
    let goalStrength = 1;

    sandbox.load(frag)
    sandbox.setUniform('image', img.currentSrc)
    sandbox.setUniform('strength', currentStrength)
        sizer()
    window.addEventListener('resize', function() {
      sizer(img, canvas)
    })
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry =>{
        if(entry.intersectionRatio > 0){
           goalStrength = 0
        } else {
          goalStrength = 1
        }
        sandbox.setUniform('strength', currentStrength)
      })
    }, {
      threshold:[0.0, 0.2, 1.0]
    })
    observer.observe(img)

    const animate = () => {
      //animate current strength 
      const diff = goalStrength - currentStrength
      currentStrength += diff * 0.03
      
      sandbox.setUniform("strength", currentStrength)
      requestAnimationFrame(animate)
    }
    
    animate();
  })
  
  //goal : wave the image based on scroll speed - not into / out of frame
  document.addEventListener("scroll", () =>{
    animate();
  })
  
})



const getScrollVelocity = () =>{
  let prevPos = 0;
  let diff = 0;
  let timer;
  let curPos = window.pageYOffset
  
  const clear = () =>{
    diff = 0;
  }
  
  const getSpeed = () =>{
    curPos = window.scrollY
    diff = curPos - prevPos //save the diff
    prevPos = curPos
    clearTimeout(timer)
    timer = setTimeout(clear(), 50) //reset timer with a 50ms delay
   	return curPos
  }
  return getSpeed()
}

document.addEventListener("scroll", function(){
	console.log(getScrollVelocity());
})