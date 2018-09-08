; (function (global) {

    defaultData = {
        NS_SVG: 'http://www.w3.org/2000/svg'
    }

    var imageAnnotation = {
        svg: null,
        tempLines: null,    // 保存当前创建的线 用于创建围栏
        tempPointList: [],  // 保存当前未变成多边形的点的列表
        tempPointMap: {},   // 保存当前未变成多边形的点的横纵坐标
        idNumber: 0,        // svg节点id 自增长 防止重复
        init: (id) => {
            if (!id) {
                return;
            }
            var _this = imageAnnotation;
            var tempElement = document.getElementById(id);
            if (tempElement) {
                _this.svg = document.createElementNS(defaultData.NS_SVG, 'svg');
                _this.svg.setAttribute('width', tempElement.clientWidth);
                _this.svg.setAttribute('height', tempElement.clientHeight);
                _this.svg.setAttribute('version', 1.1);
                tempElement.appendChild(_this.svg);
            }
            _this.svg.addEventListener('click', (data, err) => {
                let circle = createCircle(data.x, data.y);
                if (circle) {
                    _this.svg.appendChild(circle);
                    _this.tempLines = createLine(data.x, data.y, data.x, data.y);
                    _this.svg.appendChild(_this.tempLines);
                    let json = {
                        x: data.x,
                        y: data.y,
                        point: circle
                    };
                    _this.tempPointList.push(json);
                }
            });
            _this.svg.addEventListener('mousemove', (data) => {
                if (_this.tempLines) {
                    let json = selectNearPoint(data.x, data.y);
                    _this.tempLines.setAttribute('x2', json.x);
                    _this.tempLines.setAttribute('y2', json.y);

                }

            })
        }
    }

    function createCircle(x, y) {
        if (x, y) {
            let circle = document.createElementNS(defaultData.NS_SVG, 'circle');
            circle.setAttribute('r', 3);
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('fill', 'black');
            return circle;
        } else {
            return null;
        }
    }
    function createLine(sourceX, sourceY, targetX, targetY) {
        if (sourceX && sourceY && targetX && targetY) {
            let line = document.createElementNS(defaultData.NS_SVG, 'line');
            line.setAttribute('x1', sourceX);
            line.setAttribute('y1', sourceY);
            line.setAttribute('x2', targetX);
            line.setAttribute('y2', targetY);
            line.setAttribute('style', 'stroke: black');
            return line;
        }
    }

    function selectNearPoint(x, y) {
        var _this = imageAnnotation;
        if (x, y) {
            let length = _this.tempPointList.length;
            let tempSelectPoint = [];   // 临时选中的点 用于二次判断
            // 先根据纵坐标判断 是否在点的范围
            let tempRemoving = 5;
            for (let i = 0; i < length; i++) {
                let temp = +_this.tempPointList[i].x - +x;
                temp = Math.abs(temp);
                if (temp < tempRemoving) {
                    tempSelectPoint = [];
                    tempSelectPoint.push(_this.tempPointList[i]);
                    tempRemoving = temp;
                } else if (temp === tempRemoving) {
                    tempSelectPoint.push(_this.tempPointList[i]);
                }
            }
            if (tempSelectPoint.length === 1) {
                return { x: tempSelectPoint[0].x, y: tempSelectPoint[0].y };
            } else if (tempSelectPoint.length >= 2) {
                let length = tempSelectPoint.length;
                let tempRemoving = 5;
                let tempPoint;
                for (let i = 0; i < length; i++) {
                    let temp = +tempSelectPoint[i].y - +y;
                    temp = Math.abs(temp);
                    if (temp <= tempRemoving) {
                        tempPoint = tempSelectPoint[i];
                        tempRemoving = temp;
                    }
                }
                if (tempPoint) {
                    return { x: tempPoint.x, y: tempPoint.y };
                } else {
                    return { x: x, y: y };
                }
            } else {
                return { x: x, y: y };
            }
        }
    }

    window.imageAnnotation = imageAnnotation;
})(window);

/*
 * Export as a CommonJS module
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = imageAnnotation;
}