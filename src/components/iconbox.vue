<template>
    <svg id="main_svg" viewBox="0 0 434 296" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_6_2)">
            <rect id="hidden" width="261" height="266" rx="15" fill="#f7f7f7" />
            <rect class="bottom" x="152" y="306" width="261" height="266" rx="15" fill="#f7f7f7" />

            <!-- <rect width="434" height="296" /> -->
            <rect class="bottom" x="152" y="199" :width="bottomRightRectWidth" height="82" rx="15" fill="#f7f7f7" />

            <rect class="bottom" x="22" y="199" width="118" height="82" rx="15" fill="#f7f7f7" />
            <rect class="middle" x="350" y="107" width="61" height="82" rx="15" fill="#f7f7f7" />
            <rect class="middle" x="81" y="107" :width="middleRectWidth" height="82" rx="15" fill="#f7f7f7" />
            <rect class="middle" x="22" y="107" width="46" height="82" rx="15" fill="#f7f7f7" />
            <rect class="top" x="295" y="15" width="118" height="82" rx="15" fill="#f7f7f7" />
            <rect id="top_left" class="top" :width="topLeftRectWidth" x="22" y="15" height="82" rx="15" fill="#f7f7f7" />
        </g>
        <defs>
            <clipPath id="clip0_6_2">
                <rect width="434" height="296" fill="white" />
            </clipPath>
        </defs>
    </svg>
</template>

<script>
import { onMounted, ref, watchEffect } from 'vue';
// import { loadTweenJs } from "@/composables/tween.js";
import { animate } from "popmotion"


export default {
    props: ['transitionToAllView'],
    setup(props) {

        // const { loadTweenScript } = loadTweenJs()


        const topLeftRectWidth = ref(261);
        const middleRectWidth = ref(261);
        const bottomRightRectWidth = ref(261);

        let hiddenRect;

        const dummyFunction = () => {
            console.log("hey")
        }

        onMounted(() => {
            // hiddenRect = document.getElementById("hidden")

            watchEffect(() => {
                if (props['transitionToAllView']) {

                    animate({
                        from: 261,
                        to: 118,
                        duration: 150,
                        onUpdate: (latest) => {
                            topLeftRectWidth.value = latest;
                            middleRectWidth.value = latest;
                            bottomRightRectWidth.value = latest;
                        },
                    })
                } else {
                    hiddenRect = document.getElementById("hidden")


                    // hiddenRect.addEventListener("transitionend", () => {
                    animate({
                        from: 118,
                        to: 261,
                        duration: 200,
                        elapsed: -200,
                        onUpdate: (latest) => {
                            topLeftRectWidth.value = latest;
                            middleRectWidth.value = latest;
                            bottomRightRectWidth.value = latest;
                        },
                        // onComplete: () => {
                        //     hiddenRect.removeEventListener("transitionend", dummyFunction)

                        // }

                    })
                    // });

                }
            });
        })


        return { topLeftRectWidth, middleRectWidth,bottomRightRectWidth }
    }
}
</script>

<style lang="scss" scoped>
svg {
    height: 25px;
    overflow: hidden;
    transition: height 0.2s;

    rect#hidden {
        // x: 152;
        // y: 306;
        // animation: scrollup 2s linear;
        transition: y 0.2s linear 0.2s;
    }

    &.all_view {
        rect:not(#hidden) {
            // opacity: 0;
            // animation: fade 0.5s linear;
            transition: x 0.2s linear;

            &.top,
            &.middle,
            &.bottom {
                x: 22;
            }
        }

        rect#hidden {
            x: 152;
            y: 15;
            // animation: scrollup 2s linear 2s;
            transition: y 0.2s linear 0.2s;
        }
    }

    &.dashboard_view {
        rect:not(#hidden) {
            // opacity: 0;
            // animation: fade 2s linear;
            transition: x 0.2s linear 0.2s;

        }

        rect#hidden {
            x: 152;
            y: 306;
            // animation: scrollup 2s linear 2s;
            // transition: x 2s linear;
            transition: y 0.2s linear;
        }
    }
}

@keyframes scrollup {
    0% {
        x: 152;
        y: 306;
    }

    100% {
        x: 152;
        y: 15;
    }
}

@keyframes fade {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;

    }
}
</style>

