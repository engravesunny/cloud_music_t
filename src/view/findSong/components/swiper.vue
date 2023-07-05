<template>
    <div class="carousel-container">
      <div class="carousel-slide" :style="{ transform: `translateX(${-state.currentIndex * 100}%)` }">
        <div v-for="(item, index) in items" :key="index" class="carousel-item">
          <img :src="item.imageUrl" />
        </div>
      </div>
      <div class="carousel-controls">
        <button class="pre iconfont" @click="prevSlide">&#xe779;</button>
        <button class="next iconfont" @click="nextSlide">&#xe775;</button>
        <div class="dots">
            <ul>
                <li v-for="(item, index) in items" :key="index">
                    <p :class="{iconfont:true, active:state.currentIndex===index}" @mouseover="state.currentIndex=index">&#xe711;</p>
                </li>
            </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, onMounted } from 'vue';
  
  export default {
    name: 'Carousel',
    props: {
      items: {
        type: Array,
        required: true,
      },
    },
    setup(props) {
      const state = reactive({
        currentIndex: 0,
      });
      // 轮播图定时器
      let timer = null

      // 上一张
      const prevSlide = () => {
        if(state.currentIndex === 0){
            state.currentIndex = props.items.length-1
        } else {
            state.currentIndex--
        }
      };
  
      // 下一张
      const nextSlide = () => {
        if(state.currentIndex === props.items.length-1){
            state.currentIndex = 0
        } else {
            state.currentIndex++
        }
      };
      
      // 左边按钮
      const leftBtn = () => {
        if(timer){
            clearInterval(timer)
            timer = null
            timer = setInterval(() => {
                nextSlide();
            }, 3000);
        }
        prevSlide()
      }

      // 右边按钮
      const rightBtn = () => {
        if(timer){
            clearInterval(timer)
            timer = null
            timer = setInterval(() => {
                nextSlide();
            }, 3000);
        }
        nextSlide()
      }

      onMounted(() => {
        timer = setInterval(() => {
          nextSlide();
        }, 3000);
      });
  
      return {
        state,
        prevSlide,
        nextSlide,
      };
    },
  };
  </script>
  
  <style>
  .carousel-container {
    position: relative;
    width: 100%;
    height: 380px;
    overflow: hidden;
  }
  
  .carousel-slide {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease-in-out;
  }
  
  .carousel-item {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
  }
  
  .carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .carousel-container .pre {
    position: absolute;
    top: 0;
    left: 0;

  }
  .carousel-container .next {
    position: absolute;
    top: 0;
    right: 0;
  }
  
  .carousel-controls button {
    height: 100%;
    padding: 10px 20px;
    border: none;
    background:rgba(255, 255, 255, 0);
    color: #fff;
    cursor: pointer;
  }
  .carousel-controls .next:hover {
    background:
    linear-gradient(to right, 
    rgba(0,0,0,0) 0%,  
    rgba(0,0,0,0.4) 100%);
  }
  .carousel-container .pre:hover {
    background:
    linear-gradient(to left, 
    rgba(0,0,0,0) 0%,  
    rgba(0,0,0,0.4) 100%);
  }
  .dots {
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
  .dots ul {
    display: flex;
  }
  .dots ul li {
    margin: 3px;
  }
  .dots .iconfont {
    border-radius: 50%;
    font-size: 14px;
    color: #fff;
  }
  .dots ul .active {
    color: pink;
  }
  </style>
  