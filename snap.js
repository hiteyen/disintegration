function disintegrate($elm) {
    html2canvas($elm).then($canvas => {
        const ctx = $canvas.getContext("2d");
        const { width, height } = $canvas;
        // 返回一个ImageData对象，用来描述canvas区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为sw、高为sh。
        const originalFrame = ctx.getImageData(0, 0, width, height);

        // 创建32个新的、空白的、指定大小的 ImageData 对象。 所有的像素在新对象中都是透明的。
        const frames = [];
        for (let i = 0; i < 32; ++i) {
            frames[i] = ctx.createImageData(width, height);
        }
        // debugger
        // 将canvas所有的数据随机复制到32个frames上面
        for (x = 0; x < width; ++x) {
            for (y = 0; y < height; ++y) {
                // for (l = 0; l < 2; ++l) {
                // frames 的下表索引值。
                // 不是一般的（从0到COUNT的）随机值，而是递增的随机数，为了将像素点先集中在前几个frame，然后再往后集中，否则32个frames钟的像素太分散。
                var frameIndex = Math.floor(32 * (Math.random() + 2 * x / width) / 3);
                // imageData.data:描述一个一维数组，包含以 RGBA 顺序的数据，数据使用  0 至 255（包含）的整数表示。
                // 数组的个数为 width*height*4，所以除了宽乘高以外还要乘以4
                var pixelIndex = 4 * (y * width + x);
                // 之所以要循环4次是因为上面乘了4，得到的 pixelIndex 在 width*height*4 范围内会有一些空缺，所以要补上这些空缺，保证所有的canvas像素全部复制到32个frames上面
                for (channelOffset = 0; 4 > channelOffset; ++channelOffset) {
                    frames[frameIndex].data[pixelIndex + channelOffset] = originalFrame.data[pixelIndex + channelOffset];
                }
                // }
            }
        }

        // 创建一个div容纳frames
        const $container = document.createElement("div");
        $container.classList.add("disintegration-container");
        $container.style.width = `${width}px`;
        $container.style.height = `${height}px`;

        // 将所有包含RGBA数据的frames绘制到绘图中，生成32份和原始dom一样的元素，只是内容不同，最后将这些元素放入container中。
        const $frameCanvases = frames.map((frameData, i) => {
            const $c = $canvas.cloneNode(true);
            // 将数据从已有的 ImageData 对象绘制到位图的方法。
            $c.getContext("2d").putImageData(frameData, 0, 0);

            //过渡效果开始前的delay时间(可自行调整)，使得frames先从下标小的开始运动。
            $c.style.transitionDelay = `${1.35 * i / frames.length}s`;

            $container.appendChild($c);
            return $c;
        });

        // 让所有的canvas动起来
        // 原始dom相对定位，container绝对定位
        $elm.classList.add("disintegrated");
        $elm.appendChild($container);
        $container.offsetLeft; // 没有该句，则无法实现动画效果

        // 为32份不同内容的dom元素添加过渡效果（可自行调整）
        $frameCanvases.forEach($c => {
            const random = 2 * Math.PI * (Math.random() - .5);
            $c.style.transform = `rotate(${15 * (Math.random() - 0.5)}deg) translate(${60 * Math.cos(random)}px, ${30 * Math.sin(random)}px)
rotate(${15 * (Math.random() - 0.5)}deg)`;
            $c.style.opacity = 0;
        });
    });
}


let $btn = document.getElementById("btn")
let $content = document.getElementById("content")

$btn.onclick = (e) => {
    disintegrate($content)
}