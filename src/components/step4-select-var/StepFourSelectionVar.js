/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import CryptoJS from 'crypto-js';
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';
import { toSvg } from 'html-to-image';

const ClickableSVGFront = styled.svg`
        width: 208px;
        height: 400px;
        background-repeat: no-repeat;
        background-image: url("./images/Kropp-fram.svg");
        background-size: 208px 400px;
        background-position: center;
        & * {
            pointer-events: none;
        }
    `;

const ClickableSVGBack = styled.svg`
        width: 208px;
        height: 400px;
        background-repeat: no-repeat;
        background-image: url("./images/Kropp-bak.svg");
        background-size: 208px 400px;
        background-position: center;
        & * {
            pointer-events: none;
        }
    `;

const StepFourSelectionVar = (props) => {
    const { selectedAnswered, setSelectedAnswered, activeSteps, setActiveSteps, tabs, setTabs } = useContext(DataContext);
    const [circleFront, setCircleFront] = useState([]);
    const [circleBack, setCircleBack] = useState([]);
    const [frontImageCordinates, setFrontImageCordinates] = useState([]);
    const [backImageCordinates, setBackImageCordinates] = useState([]);
    const [nextClick, setNextClick] = useState(true);
    const [onToggleChange, setOnToggleChange] = useState(false);
    const [onToggleBack, setOnToggleBack] = useState(false);
    const [plusPos, setPlusPos] = useState(null);

    useEffect(() => {
        let contextData = getData();

        if (contextData === null) {
            props.history.push({
                pathname: '/stepOne'
            });
        }
        setNextClick(false);
        setActiveSteps(3);
    }, []);

    useEffect(() => {
        if (frontImageCordinates.length > 0) {
            imageZoomAfterClick('frontImage', 'myresult', 'myimage', 'img-zoom-lens');
            setNextClick(false);
        } else {
            setNextClick(true);
        }
    }, [frontImageCordinates?.length]);

    useEffect(() => {
        if (backImageCordinates.length > 0) {
            imageZoomAfterClick('backImage', 'myresultBack', 'myimageBack', 'img-zoom-lens-back');
            setNextClick(false);
        } else {
            setNextClick(true);
        }
    }, [backImageCordinates?.length]);

    useEffect(() => {
        const frontEle = document.getElementById('myresult');
        if (frontEle) {
            frontEle.style.opacity = 1;
            imageZoom("myimage", "myresult");
        }

    }, [onToggleChange]);
    useEffect(() => {
        const backEle = document.getElementById('myresultBack');
        if (backEle) {
            backEle.style.opacity = 1;
            imageZoomBack("myimageBack", "myresultBack");
        }

    }, [onToggleBack]);

    const getCordinates = (event) => {
        var e = event.target;
        var dim = e.getBoundingClientRect();
        var x = event.clientX - dim.left;
        var y = event.clientY - dim.top;
        // let x = e.nativeEvent.layerX;
        // let y = e.nativeEvent.layerY;

        return [x, y];
    };

    const addCircleOnFrontImage = (e) => {
        // setBackImageCordinates([]);
        // setCircleBack([]);

        let [x, y] = getCordinates(e);

        let newStateCordinates = frontImageCordinates;
        newStateCordinates.push({
            x: x,
            y: y
        });
        setFrontImageCordinates(newStateCordinates);

        let newCircle = (
            <>
                <circle
                    key={circleFront.length + 1}
                    className="cursor"
                    cx={x}
                    cy={y + 5}
                    r="15"
                    fill="none"
                />
                {/*
                <text textAnchor="middle" x={x} y={y + 5}>
                    <tspan fontWeight="normal" className="tspan-plus">+</tspan>
                </text> */}
                <text fill="#003DA5" textAnchor="middle" font-size="18" font-family="Verdana" x={x} y={y + 5}>+</text>
            </>
        );

        // update circle
        setCircleFront([newCircle, ...circleFront]);
    };

    const addCircleOnBackImage = (e) => {

        let [x, y] = getCordinates(e);

        let newStateCordinates = backImageCordinates;
        newStateCordinates.push({
            x: x,
            y: y
        });
        setBackImageCordinates(newStateCordinates);

        let newCircle = (
            <>
                <circle
                    key={circleBack.length + 1}
                    className="cursor"
                    cx={x}
                    cy={y + 5}
                    r="15"
                    fill="none"
                />{/*
                <text textAnchor="middle" x={x} y={y + 5}>
                    <tspan fontWeight="normal" className="tspan-plus">+</tspan>
                </text> */}
                <text fill="#003DA5" textAnchor="middle" font-size="18" font-family="Verdana" x={x} y={y + 5}>+</text>
            </>
        );

        // update circle
        setCircleBack([newCircle, ...circleBack]);
    };

    const handleBack = () => {
        setActiveSteps(activeSteps - 1);
        props.history.push({
            pathname: '/stepThree'
        });
    };

    const handleReset = () => {
        setFrontImageCordinates([]);
        setCircleFront([]);
        setBackImageCordinates([]);
        setCircleBack([]);
        const front = document.getElementById('myimage');
        front.src = './images/Kropp-fram.svg';
        const back = document.getElementById('myimageBack');
        back.src = './images/Kropp-bak.svg';
    };

    const handleNext = async () => {

        await setSelectedAnswered({
            ...selectedAnswered,
            stepFourSelectedVar: {
                ...selectedAnswered.stepFourSelectedVar,
                frontImageCordinates: selectedAnswered.stepFourSelectedVar.frontImageCordinates.splice(0, selectedAnswered.stepFourSelectedVar.frontImageCordinates.length),
                backImageCordinates: selectedAnswered.stepFourSelectedVar.backImageCordinates.splice(0, selectedAnswered.stepFourSelectedVar.backImageCordinates.length)
            }
        });

        if (frontImageCordinates.length > 0) {
            let frontImageCordinates2 = selectedAnswered.stepFourSelectedVar.frontImageCordinates.splice(0, selectedAnswered.stepFourSelectedVar.frontImageCordinates.length, ...frontImageCordinates);

            setSelectedAnswered({
                ...selectedAnswered,
                stepFourSelectedVar: {
                    ...selectedAnswered.stepFourSelectedVar,
                    frontImageCordinates: frontImageCordinates2
                }
            });
            sessionStorage.setItem("dermatom-context-data", CryptoJS.AES.encrypt(JSON.stringify(selectedAnswered), 'dermatom-dsk').toString());

            setActiveSteps(activeSteps + 1);
            props.history.push({
                pathname: '/stepFive'
            });
        }

        if (backImageCordinates.length > 0) {
            let backImageCordinates2 = selectedAnswered.stepFourSelectedVar.backImageCordinates.splice(0, selectedAnswered.stepFourSelectedVar.backImageCordinates.length, ...backImageCordinates);

            setSelectedAnswered({
                ...selectedAnswered,
                stepFourSelectedVar: {
                    ...selectedAnswered.stepFourSelectedVar,
                    backImageCordinates: backImageCordinates2
                }
            });
            sessionStorage.setItem("dermatom-context-data", CryptoJS.AES.encrypt(JSON.stringify(selectedAnswered), 'dermatom-dsk').toString());

            setActiveSteps(activeSteps + 1);
            props.history.push({
                pathname: '/stepFive'
            });
        }
        setTabs({
            ...tabs,
            4: false,
            5: false
        });

    };

    async function imageZoomAfterClick(imgID, resultID, absImgId, lensId) {
        // try {
        let img, lens, result, cx, cy;
        img = document.getElementById(imgID);
        const dataURL = await toSvg(img)
            .then(function (dataUrl) {
                return dataUrl;
            });
        const finalImg = document.getElementById(absImgId);
        finalImg.src = dataURL;

        result = document.getElementById(resultID);
        /*create lens:*/
        lens = document.createElement("DIV");
        lens.setAttribute("id", lensId);
        // lens.style.cursor = 'crosshair';
        // lens.style.zIndex = 2;
        // lens.style.display = 'flex';
        // lens.style.justifyContent = 'center';
        // lens.style.alignItems = 'center';
        /*insert lens:*/
        finalImg.parentElement.insertBefore(lens, finalImg);
        finalImg.style.cursor = "crosshair";
        finalImg.style.width = '208px';
        finalImg.style.height = '400px';
        /*calculate the ratio between result DIV and lens:*/
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;
        /*set background properties for the result DIV:*/
        result.style.backgroundImage = "url('" + finalImg.src + "')";
        result.style.backgroundRepeat = 'no-repeat';
        result.style.backgroundSize = (finalImg.width * cx) + "px " + (finalImg.height * cy) + "px";

        /*execute a function when someone moves the cursor over the image, or the lens:*/
        lens.addEventListener("mousemove", moveLens);
        finalImg.addEventListener("mousemove", moveLens);
        /*and also for touch screens:*/
        lens.addEventListener("touchmove", moveLens);
        finalImg.addEventListener("touchmove", moveLens);

        function moveLens(e) {
            let pos, x, y;
            /*prevent any other actions that may occur when moving over the image:*/
            e.preventDefault();
            /*get the cursor's x and y positions:*/
            pos = getCursorPos(e);
            /*calculate the position of the lens:*/
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);
            /*prevent the lens from being positioned outside the image:*/
            if (x > finalImg.width - lens.offsetWidth) {
                x = finalImg.width - lens.offsetWidth;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > finalImg.height - lens.offsetHeight) {
                y = finalImg.height - lens.offsetHeight;
            }
            if (y < 0) {
                y = 0;
            }
            /*set the position of the lens:*/
            lens.style.left = x + "px";
            lens.style.top = y + "px";
            /*display what the lens "sees":*/
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }

        function getCursorPos(e) {
            let a, x = 0,
                y = 0;
            e = e || window.event;
            /*get the x and y positions of the image:*/
            a = finalImg.getBoundingClientRect();
            /*calculate the cursor's x and y coordinates, relative to the image:*/
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {
                x: x,
                y: y
            };
        }

        // } catch (e) {
        //     toast.warning("något gick fel");
        // }
    }


    async function imageZoom(imgID, resultID) {
        let img, lens, result, cx, cy;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);
        /*create lens:*/
        lens = document.createElement("DIV");
        lens.setAttribute("id", "img-zoom-lens");
        /*insert lens:*/
        img.parentElement.insertBefore(lens, img);
        img.style.cursor = "crosshair";
        /*calculate the ratio between result DIV and lens:*/
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;
        /*set background properties for the result DIV:*/
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        /*execute a function when someone moves the cursor over the image, or the lens:*/
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        /*and also for touch screens:*/
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);

        function moveLens(e) {
            let pos, x, y;
            /*prevent any other actions that may occur when moving over the image:*/
            e.preventDefault();
            /*get the cursor's x and y positions:*/
            pos = getCursorPos(e);
            setPlusPos(pos);
            /*calculate the position of the lens:*/
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);
            /*prevent the lens from being positioned outside the image:*/
            if (x > img.width - lens.offsetWidth) {
                x = img.width - lens.offsetWidth;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > img.height - lens.offsetHeight) {
                y = img.height - lens.offsetHeight;
            }
            if (y < 0) {
                y = 0;
            }
            /*set the position of the lens:*/
            lens.style.left = x + "px";
            lens.style.top = y + "px";
            /*display what the lens "sees":*/
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }

        function getCursorPos(e) {
            let a, x = 0,
                y = 0;
            e = e || window.event;
            /*get the x and y positions of the image:*/
            a = img.getBoundingClientRect();
            /*calculate the cursor's x and y coordinates, relative to the image:*/
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {
                x: x,
                y: y
            };
        }
    }

    function imageZoomBack(imgID, resultID) {
        let img, lensBack, result, cx, cy;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);
        /*create lensBack:*/
        lensBack = document.createElement("DIV");
        lensBack.setAttribute("id", "img-zoom-lens-back");

        /*insert lensBack:*/
        img.parentElement.insertBefore(lensBack, img);
        img.style.cursor = "crosshair";
        /*calculate the ratio between result DIV and lensBack:*/
        cx = result.offsetWidth / lensBack.offsetWidth;
        cy = result.offsetHeight / lensBack.offsetHeight;
        /*set background properties for the result DIV:*/
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        /*execute a function when someone moves the cursor over the image, or the lensBack:*/
        lensBack.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        /*and also for touch screens:*/
        lensBack.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);


        function moveLens(e) {
            let pos, x, y;
            /*prevent any other actions that may occur when moving over the image:*/
            e.preventDefault();
            /*get the cursor's x and y positions:*/
            pos = getCursorPos(e);
            /*calculate the position of the lensBack:*/
            x = pos.x - (lensBack.offsetWidth / 2);
            y = pos.y - (lensBack.offsetHeight / 2);
            /*prevent the lensBack from being positioned outside the image:*/
            if (x > img.width - lensBack.offsetWidth) {
                x = img.width - lensBack.offsetWidth;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > img.height - lensBack.offsetHeight) {
                y = img.height - lensBack.offsetHeight;
            }
            if (y < 0) {
                y = 0;
            }
            /*set the position of the lensBack:*/
            lensBack.style.left = x + "px";
            lensBack.style.top = y + "px";
            /*display what the lensBack "sees":*/
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }

        function getCursorPos(e) {
            let a, x = 0,
                y = 0;
            e = e || window.event;
            /*get the x and y positions of the image:*/
            a = img.getBoundingClientRect();
            /*calculate the cursor's x and y coordinates, relative to the image:*/
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {
                x: x,
                y: y
            };
        }
    }

    const show = () => {
        setOnToggleChange(true);
    }

    const showBack = () => {
        setOnToggleBack(true);
    }

    const onMouseToggle = () => {
        if (onToggleChange) {
            const zoomElement = document.querySelectorAll("#img-zoom-lens");
            if (zoomElement?.length > 0) {
                for (let i = 0; i < zoomElement?.length; i++) {
                    zoomElement[i].remove();
                }
            }
        }
        setOnToggleChange(false);
    }

    const onMouseBack = () => {
        if (onToggleBack) {
            const zoomElement = document.querySelectorAll("#img-zoom-lens-back");
            if (zoomElement?.length > 0) {
                for (let i = 0; i < zoomElement?.length; i++) {
                    zoomElement[i].remove();
                }
            }
        }
        setOnToggleBack(false);
    }

    return (
        <>
            <main className="bg-white">
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex flex-column">
                            <p className="font-34 mb-4">4. Var gör det ont?</p>
                            <div className="row d-flex var-img-height" >
                                <div className="col-6 h-100 text-end pe-6 img-zoom-container" style={{ justifyContent: "end" }}>
                                    {/*<ClickableSVGFront id="myimage" onClick={addCircleOnFrontImage} onMouseEnter={show}>
                                        {circleFront}
    </ClickableSVGFront> */}


                                    {
                                        onToggleBack === true &&
                                        (<div id="myresultBack" className="img-zoom-result-back" style={{ position: "absolute", zIndex: 1, backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <svg id="myresultBackPlus" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /> </svg>
                                        </div>)
                                    }
                                    <div className="img-zoom-container" onMouseEnter={show} onMouseLeave={() => onMouseToggle(false)} onClick={addCircleOnFrontImage} style={{ height: "360px" }}>
                                        <div style={{ height: '400px', position: 'absolute' }}>
                                            <img id="myimage" src="./images/Kropp-fram.svg" width="208" height="400" style={{ position: "absolute" }} />
                                        </div>
                                        <div id='frontImage' style={{ height: '400px' }}>
                                            <ClickableSVGFront>
                                                {circleFront}
                                            </ClickableSVGFront>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 h-100 text-start ps-6 img-zoom-container-back">
                                    {
                                        onToggleChange === true &&
                                        (<div id="myresult" className="img-zoom-result" style={{ position: "absolute", zIndex: 1, backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /> </svg>
                                        </div>)
                                    }
                                    <div className="img-zoom-container-back" onMouseEnter={showBack} onMouseLeave={() => onMouseBack(false)} onClick={addCircleOnBackImage} style={{ height: "400px" }}>
                                        <div style={{ height: '400px', position: 'absolute' }}>
                                            <img id="myimageBack" src="./images/Kropp-bak.svg" width="208" height="400" style={{ position: "absolute" }} />
                                        </div>
                                        <div id='backImage' style={{ height: '400px' }}>
                                            <ClickableSVGBack>
                                                {circleBack}
                                            </ClickableSVGBack>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="d-flex align-items-end bg-white">
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <button className="btn btn-back d-flex" onClick={handleBack}><span className="arrow_carrot-left font-26 me-3"></span> Tillbaka</button>
                        </div>
                        {/*<div className="col-4 text-center">
                            <button className="btn btn-primary" onClick={handleReset} disabled={nextClick}>Återställ</button>
                                </div>
                        <div className="col-4">
                            <button className="btn btn-primary d-flex pe-0 w-130px justify-content-between ms-auto" onClick={handleNext} disabled={nextClick}>Nästa <span className="arrow_carrot-right font-26 mr--10px"></span></button>
                                </div>*/}
                        <div className="col-4 d-flex justify-content-center align-items-center">
                            <span>Framtaget i samarbete med Jan Rickard Norrefalk</span>
                        </div>
                        <div className="col-4 d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={handleReset} disabled={nextClick}>Återställ</button>
                            <button className="btn btn-primary d-flex pe-0 w-130px justify-content-between ml-20" onClick={handleNext} disabled={nextClick}>Nästa <span className="arrow_carrot-right font-26 mr--10px"></span></button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default StepFourSelectionVar;