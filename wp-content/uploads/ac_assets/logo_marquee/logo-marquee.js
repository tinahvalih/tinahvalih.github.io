function UCMarquee(marquee) {
  
  var g_marquee;
  
  function cloneSlider() {
    Array.prototype.forEach.call(g_marquee, item => {
      var parent = item
      var slide = item.children
      Array.prototype.forEach.call(slide, item => {
        parent.appendChild(item.cloneNode(true))
      })
    })
  }
  
  function wrapSlides() {
    Array.prototype.forEach.call(g_marquee, item => {
      item.innerHTML = '<div class="uc-logo-wrapper">' + item.innerHTML + '</div>'
    })
  }
  
  function setWidth() {
    Array.prototype.forEach.call(g_marquee, parentItem => {
      
      //make sure that parentItem is displayed on a page before measure its width
      parentItem.style.display = "flex";
      
      var parentWidth = parentItem.offsetWidth;
      var slide = parentItem.querySelectorAll('.uc_logo_marquee_holder');
      var viewportWidth = parseInt(window.innerWidth);
      
      var isBreakPoint = function (breakpoint) {
        var breakpointsArray = [319, 767, 1024, 1920];
        var breakpointsArrayLength = breakpointsArray.length;
        var min, max;
        
        for (var i = 0; i < breakpointsArrayLength; i++) {
          if (breakpointsArray[i] === breakpoint) {
            min = breakpointsArray[i-1] || 0
            max = breakpointsArray[i]
            break
          }
        }
        return viewportWidth > min && viewportWidth <= max
      }
      
      var dataHeight = parseInt(jQuery(parentItem).attr('data-height'));
      var dataMarginDesktop = jQuery(parentItem).data('desktop-margin');
      var dataMarginTablet = jQuery(parentItem).data('tablet-margin');
      var dataMarginMobile = jQuery(parentItem).data('mobile-margin');
      var dataItemsNumberMobile = jQuery(parentItem).data('mobile-items');
      var dataItemsNumberTablet = jQuery(parentItem).data('tablet-items');
      var dataItemsNumberDesktop = jQuery(parentItem).data('desktop-items');
      var direction = jQuery(parentItem).data('direction');
      
      if (direction == 'up' || direction == 'down'){
        
        if (isBreakPoint(767))
          parentItem.style.height = (dataHeight + dataMarginMobile) * dataItemsNumberMobile + 'px'
        
        if (isBreakPoint(1024))
          parentItem.style.height = (dataHeight + dataMarginTablet) * dataItemsNumberTablet + 'px'
        
        if (isBreakPoint(1920) || viewportWidth > 1920 )
          parentItem.style.height = (dataHeight + dataMarginDesktop) * dataItemsNumberDesktop + 'px'
        
      }
      
      parentItem.style.display = "none";
      
      Array.prototype.forEach.call(slide, item => {
        
        if(direction == 'right' || direction == 'left'){
          if (isBreakPoint(767))
            item.style.marginRight = dataMarginMobile + 'px'
          
          if (isBreakPoint(1024))
            item.style.marginRight = dataMarginTablet + 'px'
          
          if (isBreakPoint(1920) || viewportWidth > 1920 )
            item.style.marginRight = dataMarginDesktop + 'px'
        }
        
        if(direction == 'up' || direction == 'down'){
          if (isBreakPoint(767))
            item.style.marginTop = dataMarginMobile + 'px'
          
          if (isBreakPoint(1024))
            item.style.marginTop = dataMarginTablet + 'px'
          
          if (isBreakPoint(1920) || viewportWidth > 1920 )
            item.style.marginTop = dataMarginDesktop + 'px'
        }  
        
        if(direction == 'right' || direction == 'left' ){
          
          if (isBreakPoint(767)) 
            item.style.width = (parentWidth / dataItemsNumberMobile) - dataMarginMobile + 'px'
          
          if (isBreakPoint(1024)) 
            item.style.width = (parentWidth / dataItemsNumberTablet) - dataMarginTablet + 'px'
          
          if (isBreakPoint(1920) || (viewportWidth > 1920)) 
            item.style.width = (parentWidth / dataItemsNumberDesktop) - dataMarginDesktop + 'px'
          
        }
      })
      
      setTimeout(function(){
        parentItem.style.display = "flex";
      },200);
      
    })
  }
  
  function setAnimationOptions() {
    Array.prototype.forEach.call(g_marquee, item => {
      var speed = jQuery(item).data('speed');
      var marqueeList = item.children[0]
      var slidesAmount = marqueeList.children.length / 4
      var marqueeSpeed = speed * slidesAmount
      
      marqueeList.style.animationDuration = marqueeSpeed / 1000 + 's'
      marqueeList.style.WebkitAnimationDuration = marqueeSpeed / 1000 + 's'
      
      var paused = jQuery(item).data('paused');
      
      if (paused) {
        marqueeList.onmouseenter = (event) => {
          event.target.style.animationPlayState = 'paused'
          event.target.style.WebkitAnimationPlayState = 'paused'
        }
        marqueeList.onmouseleave = (event) => {
          event.target.style.animationPlayState = ''
          event.target.style.WebkitAnimationPlayState = ''
        }
      }
      
    })
  }
  
  function init() {
    
    g_marquee = marquee;
    
    cloneSlider()
    cloneSlider()
    setWidth()
    wrapSlides()
    setAnimationOptions()
    
    
    var width = jQuery(window).width();
    
    window.addEventListener('resize', function() {
      
      if (jQuery(this).width() != width) {
        
        width = jQuery(this).width();
        
        setWidth()
        
      }
      
    })
  }
  
  init()
}