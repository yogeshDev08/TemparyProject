/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, activeSteps } from 'react';
import jsPDF from 'jspdf';
import styled from 'styled-components';
import { DataContext } from '../../hooks/data-manager/DataContext';
import { getData } from '../../utils/util';
import LoadingDots from '../loding-dots/LodingDots';
import { ReactComponent as CentralaFram } from './Centrala-fram.svg';
import { ReactComponent as CentralaBak } from './Centrala-bak.svg';
import { ReactComponent as PeriferaFram } from './Perifera-fram.svg';
import { ReactComponent as PeriferaBak } from './Perifera-bak.svg';
import { toSvg } from 'html-to-image';
import { toast } from 'react-toastify';


const scaling = 1.25;

const CentralaSVGFront = styled.svg`
        width: 208px;
        height: 400px;
        background-repeat: no-repeat;
        background-image: url("./images/Centrala-fram.svg");
        background-size: 208px 400px;
        background-position: center;
        transition: all 0.5s ease 0s;
        & * {
            pointer-events: none;
        }
    `;

const PeriferaSVGFront = styled.svg`
        width: 208px;
        height: 400px;
        background-repeat: no-repeat;
        background-image: url("./images/Perifera-fram.svg");
        background-size: 208px 400px;
        background-position: center;
        transition: all 0.5s ease 0s;
        & * {
            pointer-events: none;
        }
    `;

const CentralaSVGBack = styled.svg`
        width: 208px;
        height: 400px;
        background-repeat: no-repeat;
        background-image: url("./images/Centrala-bak.svg");
        background-size: 208px 400px;
        background-position: center;
        transition: all 0.5s ease 0s;
        & * {
            pointer-events: none;
        }
    `;

const PeriferaSVGBack = styled.svg`
        width: 208px;
        height: 400px;
        background-repeat: no-repeat;
        background-image: url("./images/Perifera-bak.svg");
        background-size: 208px 400px;
        background-position: center;
        transition: all 0.5s ease 0s;
        & * {
            pointer-events: none;
        }
    `;

const SummaryReport = (props) => {
    const { setActiveSteps } = useContext(DataContext);
    const [circleFront, setCircleFront] = useState([]);
    const [circlePriferaFront, setCirclePriferaFront] = useState([]);
    const [circleBack, setCircleBack] = useState([]);
    const [circlePriferaBack, setCirclePriferaBack] = useState([]);
    const [summaryReport, setSummaryReport] = useState();
    const [frontImageVisible, setFrontImageVisible] = useState(false);
    const [backImageVisible, setBackImageVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(true);
    const [onToggleFirst, setOnToggleFirst] = useState(false);
    const [onToggleSecond, setOnToggleSecond] = useState(false);
    const [onToggleThree, setOnToggleThree] = useState(false);
    const [onToggleFour, setOnToggleFour] = useState(false);

    let currentDate = new Date(),
        month = '' + (currentDate.getMonth() + 1),
        day = '' + currentDate.getDate(),
        year = currentDate.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    let finalDate = `${[year, month, day].join('-')}`;

    useEffect(() => {
        let summaryData = getData();

        setActiveSteps(5);
        if (summaryData !== null) {
            setSummaryReport(summaryData);
        } else {
            props.history.push({
                pathname: '/stepOne'
            });
        }

        if (summaryData !== null && summaryData?.stepFourSelectedVar.frontImageCordinates.length > 0) {
            setFrontImageVisible(true);
            addCircleOnFrontImage(summaryData);
        }

        if (summaryData !== null && summaryData?.stepFourSelectedVar.backImageCordinates.length > 0) {
            setBackImageVisible(true);
            addCircleOnBackImage(summaryData);
        }
    }, []);

    useEffect(() => {
        const frontEle = document.getElementById('firstImageResult');
        if (frontEle) {
            frontEle.style.opacity = 1;
            imageZoom("firstImage", "firstImageResult", "absFirstImg", "img-zoom-lens-first");
        }

    }, [onToggleFirst]);

    useEffect(() => {
        const frontEle = document.getElementById('secondImageResult');
        if (frontEle) {
            frontEle.style.opacity = 1;
            imageZoom("secondImage", "secondImageResult", "absSecondImg", "img-zoom-lens-second");
        }

    }, [onToggleSecond]);

    useEffect(() => {
        const frontEle = document.getElementById('thirdImageResult');
        if (frontEle) {
            frontEle.style.opacity = 1;
            imageZoom("thirdImage", "thirdImageResult", "absThirdImg", "img-zoom-lens-third");
        }

    }, [onToggleThree]);

    useEffect(() => {
        const frontEle = document.getElementById('fourImageResult');
        if (frontEle) {
            frontEle.style.opacity = 1;
            imageZoom("fourImage", "fourImageResult", "absFourImg", "img-zoom-lens-four");
        }

    }, [onToggleFour]);

    useEffect(() => {
        if (!hidden) {
            (async () => {
                await generatePdf();
            })();
        }
    }, [hidden]);

    function addCircleOnFrontImage(summaryData) {
        let frontImageCordinates = summaryData.stepFourSelectedVar.frontImageCordinates;
        let circleFrontArr = [];
        let circlePeriferaFrontArr = [];

        frontImageCordinates.forEach((item) => {
            let newCircle = (
                <>
                    <circle
                        key={circleFrontArr.length + 1}
                        className="cursor"
                        cx={item.x}
                        cy={item.y + 5}
                        r="15"
                        fill="none"
                    />
                    <text fill="#003DA5" textAnchor="middle" font-size="18" font-family="Verdana" x={item.x} y={item.y + 5}>+</text>
                </>
            );
            let newCircleForPerifera = (
                <>
                    <circle
                        key={`periferaFront${circleFrontArr.length + 1}`}
                        className="cursor"
                        cx={item.x}
                        cy={item.y + 5}
                        r="15"
                        fill="none"
                    />
                    <text fill="#003DA5" textAnchor="middle" font-size="18" font-family="Verdana" x={item.x} y={item.y + 5}>+</text>
                    {/*<text textAnchor="middle" x={item.x} y={item.y}>
                        <tspan fontWeight="normal" className="tspan-plus">+</tspan>
                    </text>*/}
                </>
            );
            circleFrontArr.push(newCircle);
            circlePeriferaFrontArr.push(newCircleForPerifera);
        })
        // update circle
        setCircleFront([...circleFront, circleFrontArr]);
        setCirclePriferaFront([...circlePriferaFront, circlePeriferaFrontArr]);
    };

    function addCircleOnBackImage(summaryData) {
        let backImageCordinates = summaryData.stepFourSelectedVar.backImageCordinates;
        let circleBackArr = [];
        let circlePeriferaBackArr = [];

        backImageCordinates.forEach((item) => {
            let newCircle = (
                <>
                    <circle
                        key={circleBackArr.length + 1}
                        className="cursor"
                        cx={item.x}
                        cy={item.y + 5}
                        r="15"
                        fill="none"
                    />
                    <text fill="#003DA5" textAnchor="middle" font-size="18" font-family="Verdana" x={item.x} y={item.y + 5}>+</text>
                </>
            );
            let newCircleForPerifera = (
                <>
                    <circle
                        key={`periferaBack${circlePeriferaBackArr.length + 1}`}
                        className="cursor"
                        cx={item.x}
                        cy={item.y + 5}
                        r="15"
                        fill="none"
                    />
                    <text fill="#003DA5" textAnchor="middle" font-size="18" font-family="Verdana" x={item.x} y={item.y + 5}>+</text>
                </>
            );

            circleBackArr.push(newCircle);
            circlePeriferaBackArr.push(newCircleForPerifera);
        })
        // update circle
        setCircleBack([...circleBack, circleBackArr]);
        setCirclePriferaBack([...circlePriferaBack, circlePeriferaBackArr]);
    };

    const handleBack = () => {
        setActiveSteps(activeSteps - 1);
        props.history.push({
            pathname: '/stepFour'
        });
    };

    // console.log('circleFront - circleBack', circleFront, circleBack);

    // const savePdf = () => {
    //     setHidden(false);
    //     setLoading(true);

    //     setTimeout(() => {
    //         let summaryDiv = document.getElementById('summary');

    //         let w = document.getElementById("summary").offsetWidth;
    //         let h = document.getElementById("summary").offsetHeight;

    //         const pdf = new jsPDF('p', 'mm', 'a4', [w, h], true);

    //         pdf.setFontSize(20);
    //         pdf.setFont('Clearface Black SSi', 'bolditalic');
    //         pdf.setTextColor("#003DA5");
    //         pdf.text(55, 10, `Sammanfattning ${finalDate}`);

    //         const logo = './images/GSK-logo.png';
    //         pdf.addImage(logo, 'PNG', 190, 2, 13, 10);

    //         html2canvas(summaryDiv, {
    //             scale: 5
    //         })
    //             .then((canvas) => {

    //                 let imgC = canvas.toDataURL('image/jpeg');

    //                 let width = pdf.internal.pageSize.getWidth();
    //                 let height = pdf.internal.pageSize.getHeight();
    //                 let widthRatio = width / canvas.width;
    //                 let heightRatio = height / canvas.height;

    //                 let ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
    //                 pdf.addImage(imgC, 'JPEG', 0, 20, canvas.width * ratio, (canvas.height * ratio), undefined, 'FAST');

    //                 // ----------------- Added second page --------------------------------
    //                 // -------------------------------------------------------------------

    //                 pdf.save(`Report.${finalDate}.pdf`);
    //                 setHidden(true);
    //                 setLoading(false);
    //             })
    //             .catch(() => {
    //                 setLoading(false);
    //                 setHidden(true);
    //             })
    //     }, 4000);
    // }

    const generatePdf = async () => {
        try {
            let w = document.getElementById("summary").offsetWidth;
            let h = document.getElementById("summary").offsetHeight;

            const pdf = new jsPDF('p', 'mm', 'a4', [w, h], true);

            pdf.setFontSize(20);
            pdf.setFont('Clearface Black SSi', 'bolditalic');
            pdf.setTextColor("#003DA5");
            pdf.text(55, 10, `Sammanfattning ${finalDate}`);

            const logo = './images/GSK-logo.png';
            pdf.addImage(logo, 'PNG', 192, 4, 12, 10);

            pdf.setLineWidth(1.0);
            pdf.setDrawColor('#003DA5');
            pdf.line(0, 20, 3508, 20);


            const { stepOneSelectedNar = [], stepTwoSelectedTid = [], stepThreeSelectedHur = [] } = summaryReport;

            // Nar
            let narXValue = 100;
            let narYValue = 30;


            // Tid
            let tidXValue = 100;
            let tidYValue = narYValue + (stepOneSelectedNar.length * 25) + (stepOneSelectedNar.length * 15) + (stepOneSelectedNar.length === 1 ? 10 : 0);


            // Hur
            let hurXValue = 155;
            let hurYValue = 30;




            if (frontImageVisible) {
                // Nar
                if (stepOneSelectedNar.length > 0) {
                    pdf.setLineWidth(1.0);
                    pdf.setFontSize(16);
                    pdf.setDrawColor("#003DA5");

                    pdf.line(narXValue, narYValue, narXValue + 50, narYValue);
                    pdf.text(narXValue + 5, narYValue + 8, 'När gör det ont');
                    pdf.line(narXValue, narYValue + 12, narXValue + 50, narYValue + 12);

                    for (const [narIdx, index] in stepOneSelectedNar) {
                        const frontImgArray = await getOtherDataUrl(`nar${narIdx}-`);
                        if (frontImgArray?.length > 0) {

                            for (const front of frontImgArray) {
                                const pngUrl = await svgString2Image(front, 400, 200, 'png');
                                pdf.addImage(pngUrl, 'PNG', narXValue + 10, narYValue + (narIdx * 30) + 15, 25, 30);
                            }
                        }
                    }
                }
                // Tid
                if (stepTwoSelectedTid.length > 0) {
                    pdf.line(tidXValue, tidYValue, tidXValue + 50, tidYValue);
                    pdf.text(tidXValue + 20, tidYValue + 8, 'Tid');
                    pdf.line(tidXValue, tidYValue + 12, tidXValue + 50, tidYValue + 12);

                    for (const [tidIdx, index] in stepTwoSelectedTid) {
                        const frontImgArray = await getOtherDataUrl(`tid${tidIdx}-`);
                        if (frontImgArray?.length > 0) {
                            for (const front of frontImgArray) {
                                const pngUrl = await svgString2Image(front, 400, 200, 'png');
                                pdf.addImage(pngUrl, 'PNG', tidXValue + 15, tidYValue + (tidIdx * 25) + 15, 20, 25);
                            }
                        }
                    }
                }
                // Hur
                if (stepThreeSelectedHur.length > 0) {
                    pdf.line(hurXValue, hurYValue, hurXValue + 50, hurYValue);
                    pdf.text(hurXValue + 5, hurYValue + 8, 'Hur gör det ont');
                    pdf.line(hurXValue, hurYValue + 12, hurXValue + 50, hurYValue + 12);

                    for (const [hurIdx, index] in stepThreeSelectedHur) {
                        const frontImgArray = await getOtherDataUrl(`hur${hurIdx}-`);
                        if (frontImgArray?.length > 0) {
                            for (const front of frontImgArray) {
                                const pngUrl = await svgString2Image(front, 400, 200, 'png');
                                pdf.addImage(pngUrl, 'PNG', hurXValue + 10, hurYValue + (hurIdx * 30) + 15, 30, 25);
                            }
                        }
                    }
                }

                const frontImgArray = await getNerverDataUrl('first', 'second');
                if (frontImgArray?.length === 2) {
                    for (const [i, front] of frontImgArray.entries()) {
                        const pngUrl = await svgString2Image(front, 800, 600, 'png');
                        pdf.setFontSize(16);
                        pdf.text(35, (i * 120 + 35), i === 0 ? 'Centrala nerver' : 'Perifera nerver');
                        pdf.addImage(pngUrl, 'PNG', 25, (i * 120 + 40), 55, 100);
                    }
                }
            }

            if (backImageVisible) {
                if (frontImageVisible) {
                    pdf.addPage();
                    pdf.addImage(logo, 'PNG', 192, 4, 12, 10);
                    pdf.setLineWidth(1.0);
                    pdf.line(0, 20, 3508, 20);
                }

                // Nar
                if (stepOneSelectedNar.length > 0) {
                    pdf.setLineWidth(1.0);
                    pdf.setFontSize(16);
                    pdf.setDrawColor("#003DA5");

                    pdf.line(narXValue, narYValue, narXValue + 50, narYValue);
                    pdf.text(narXValue + 5, narYValue + 8, 'När gör det ont');
                    pdf.line(narXValue, narYValue + 12, narXValue + 50, narYValue + 12);

                    for (const [narIdx, index] in stepOneSelectedNar) {
                        const frontImgArray = await getOtherDataUrl(`nar${narIdx}-`);
                        if (frontImgArray?.length > 0) {

                            for (const front of frontImgArray) {
                                const pngUrl = await svgString2Image(front, 400, 200, 'png');
                                pdf.addImage(pngUrl, 'PNG', narXValue + 10, narYValue + (narIdx * 30) + 15, 25, 30);
                            }
                        }
                    }
                }
                // Tid
                if (stepTwoSelectedTid.length > 0) {
                    pdf.line(tidXValue, tidYValue, tidXValue + 50, tidYValue);
                    pdf.text(tidXValue + 20, tidYValue + 8, 'Tid');
                    pdf.line(tidXValue, tidYValue + 12, tidXValue + 50, tidYValue + 12);

                    for (const [tidIdx, index] in stepTwoSelectedTid) {
                        const frontImgArray = await getOtherDataUrl(`tid${tidIdx}-`);
                        if (frontImgArray?.length > 0) {
                            for (const front of frontImgArray) {
                                const pngUrl = await svgString2Image(front, 400, 200, 'png');
                                pdf.addImage(pngUrl, 'PNG', tidXValue + 15, tidYValue + (tidIdx * 25) + 15, 20, 25);
                            }
                        }
                    }
                }
                // Hur
                if (stepThreeSelectedHur.length > 0) {
                    pdf.line(hurXValue, hurYValue, hurXValue + 50, hurYValue);
                    pdf.text(hurXValue + 5, hurYValue + 8, 'Hur gör det ont');
                    pdf.line(hurXValue, hurYValue + 12, hurXValue + 50, hurYValue + 12);

                    for (const [hurIdx, index] in stepThreeSelectedHur) {
                        const frontImgArray = await getOtherDataUrl(`hur${hurIdx}-`);
                        if (frontImgArray?.length > 0) {
                            for (const front of frontImgArray) {
                                const pngUrl = await svgString2Image(front, 400, 200, 'png');
                                pdf.addImage(pngUrl, 'PNG', hurXValue + 10, hurYValue + (hurIdx * 30) + 15, 30, 25);
                            }
                        }
                    }
                }

                const frontImgArray = await getNerverDataUrl('third', 'four');
                if (frontImgArray?.length === 2) {
                    for (const [i, front] of frontImgArray.entries()) {
                        const pngUrl = await svgString2Image(front, 800, 600, 'png');
                        pdf.text(35, (i * 120 + 35), i === 0 ? 'Centrala nerver' : 'Perifera nerver');
                        pdf.addImage(pngUrl, 'PNG', 23, (i * 120 + 40), 55, 100);
                    }
                }
            }

            if (frontImageVisible || backImageVisible) {
                pdf.addPage();
                pdf.addImage(logo, 'PNG', 192, 4, 12, 10);
                pdf.setFontSize(20);
                pdf.setFont('Clearface Black SSi', 'bolditalic');
                pdf.setTextColor('#003DA5');
                pdf.text(80, 10, `Läkarens noteringar`);
                pdf.setLineWidth(1.0);
                pdf.line(0, 20, 3508, 20);
                pdf.setLineWidth(0.5);
                pdf.setDrawColor('#f2f2f2');
                let yLine = 30;
                for (let i = 1; i <= 25; i++) {
                    pdf.line(10, yLine, 200, yLine);
                    yLine += 10;
                }
            }
            setTimeout(() => {

                pdf.save(`Report.${finalDate}.pdf`);
                setLoading(false);
            }, 4000);
        } catch (error) {
            setLoading(false);
            toast.warning("något gick fel");
        }
    }

    const savePdf = async () => {
        setHidden(false);
        setLoading(true);
    }

    const filter = (node) => {
        return (node.tagName !== 'i');
    }


    const svgString2Image = (svgString, width, height, format) => new Promise((resolve, reject) => {
        // set default for format parameter
        format = format ? format : 'png';
        // SVG data URL from SVG string
        // create canvas in memory(not in DOM)
        let canvas = document.createElement('canvas');
        // get canvas context for drawing on canvas
        let context = canvas.getContext('2d');
        // set canvas size
        canvas.width = width;
        canvas.height = height;
        // create image in memory(not in DOM)
        let image = new Image();
        // later when image loads run this
        image.onload = function () { // async (happens later)
            // clear canvas
            context.clearRect(0, 0, width, height);
            // draw image with SVG data to canvas
            context.drawImage(image, 0, 0, width, height);
            // snapshot canvas as png
            resolve(canvas.toDataURL('image/' + format));
        }; // end async
        // start loading SVG data into in memory image
        image.src = svgString;
    });

    const getNerverDataUrl = async (firstImgStr, secondImgStr) => {
        let imgUrls = [];
        const firstUrl = await toSvg(document.getElementById(`${firstImgStr}Image`), { filter });
        const secondUrl = await toSvg(document.getElementById(`${secondImgStr}Image`), { filter });
        if (firstUrl && secondUrl) {
            imgUrls = [firstUrl, secondUrl];
        }
        return imgUrls;
    }

    const getOtherDataUrl = async (imgStr) => {
        return new Promise((resolve, reject) => {
            toSvg(document.getElementById(`${imgStr}Image`), { filter }).then((url) => {
                resolve([url]);
            })
        });
    }

    /** -------------------------------------- Image Code ------------------------------------------------*/

    async function imageZoom(imgID, resultID, absImgId, lensId) {
        try {
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
            lens.style.cursor = 'crosshair';
            lens.style.zIndex = 5;
            lens.style.display = 'flex';
            lens.style.justifyContent = 'center';
            lens.style.alignItems = 'center';
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
        } catch (e) {
            toast.warning("något gick fel");
        }
    }

    /** --------------------------------------------------------------------------------------------------------- */

    const showFirstImage = () => {
        setOnToggleFirst(true);
    }

    const onFirstImgToggle = () => {
        if (onToggleFirst) {
            removeLensDiv();
            // const zoomElement = document.getElementById("img-zoom-lens-first");
            // if (zoomElement) zoomElement.remove();
        }
        setOnToggleFirst(false);
    }

    const showSecondImage = () => {
        setOnToggleSecond(true);
    }

    const onSecondImgToggle = () => {
        if (onToggleSecond) {
            removeLensDiv();
            // const zoomElement = document.getElementById("img-zoom-lens-second");
            // if (zoomElement) zoomElement.remove();
        }
        setOnToggleSecond(false);
    }

    const showThirdImage = () => {
        setOnToggleThree(true);
    }

    const onThirdImgToggle = () => {
        if (onToggleThree) {
            removeLensDiv();
        }
        setOnToggleThree(false);
    }

    const showFourImage = () => {
        setOnToggleFour(true);
    }

    const onFourImgToggle = () => {
        if (onToggleFour) {
            // const zoomElement = document.getElementById("img-zoom-lens-third");
            // if (zoomElement) zoomElement.remove();
            removeLensDiv();
        }
        setOnToggleFour(false);
    }

    const removeLensDiv = () => {
        const zoomElementOne = document.querySelectorAll("#img-zoom-lens-first");
        const zoomElementSecond = document.querySelectorAll("#img-zoom-lens-second");
        const zoomElementThird = document.querySelectorAll("#img-zoom-lens-third");
        const zoomElementFour = document.querySelectorAll("#img-zoom-lens-four");
        if (zoomElementOne?.length > 0) {
            for (let i = 0; i < zoomElementOne?.length; i++) {
                zoomElementOne[i].remove();
            }
        }
        else if (zoomElementSecond?.length > 0) {
            for (let i = 0; i < zoomElementSecond?.length; i++) {
                zoomElementSecond[i].remove();
            }
        }
        else if (zoomElementThird?.length > 0) {
            for (let i = 0; i < zoomElementThird?.length; i++) {
                zoomElementThird[i].remove();
            }
        }
        else if (zoomElementFour?.length > 0) {
            for (let i = 0; i < zoomElementFour?.length; i++) {
                zoomElementFour[i].remove();
            }
        }
    };

    return (
        <>
            <main className="bg-black" style={{ backgroundColor: "#F4F6F9" }}>
                <div className="container h-100">
                    <div className="row ">
                        <div className="row d-flex h-100 cust-col">
                            <div className="col-6 col-md-6 h-100 text-center">
                                {
                                    frontImageVisible ?
                                        (<>
                                            <div className="row d-flex h-70 cust-col">
                                                <div className="col-6 col-md-6 h-100 text-center d-flex flex-column align-items-center" id="var">
                                                    <p className="font-20">Centrala nerver</p>
                                                    <div className="img-zoom-container" onMouseEnter={showFirstImage} onMouseLeave={() => onFirstImgToggle(false)} style={{ height: "400px" }}>
                                                        <div id="firstImage">
                                                            <CentralaSVGFront>
                                                                {circleFront}
                                                            </CentralaSVGFront>
                                                        </div>
                                                        <img id="absFirstImg" width="0" height="0" style={{ position: "absolute" }} />
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 h-100 text-center d-flex flex-column align-items-center" id="var2">
                                                    {onToggleFirst === true && <div id="firstImageResult" className="img-zoom-result" style={{ position: "absolute", zIndex: 1, backgroundColor: "white" }}></div>}
                                                    <p className="font-20 ">Perifera nerver</p>
                                                    <div className="img-zoom-container" onMouseEnter={showSecondImage} onMouseLeave={() => onSecondImgToggle(false)} style={{ height: "400px" }}>
                                                        <img id="absSecondImg" width="0" height="0" style={{ position: "absolute" }} />
                                                        <div id="secondImage">
                                                            <PeriferaSVGFront>
                                                                {circlePriferaFront}
                                                            </PeriferaSVGFront>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>) : ""
                                }
                                {
                                    !frontImageVisible && backImageVisible ?
                                        (<>
                                            <div className="row d-flex h-70 cust-col">
                                                <div className="col-6 col-md-6 h-100 text-center d-flex flex-column align-items-center" id="var">
                                                    {
                                                        onToggleFour === true &&
                                                        (<div id="fourImageResult" className="img-zoom-result" style={{ position: "absolute", zIndex: 1, backgroundColor: "white" }}></div>)
                                                    }
                                                    <p className="font-20 ml-10">Centrala nerver</p>
                                                    <div className="img-zoom-container" onMouseEnter={showThirdImage} onMouseLeave={() => onThirdImgToggle(false)} style={{ height: "400px" }}>
                                                        <div id="thirdImage">
                                                            <CentralaSVGBack>
                                                                {circleBack}
                                                            </CentralaSVGBack>
                                                        </div>
                                                        <img id="absThirdImg" width="0" height="0" style={{ position: "absolute" }} />
                                                    </div>

                                                </div>

                                                <div className="col-6 col-md-6 h-100 text-center d-flex flex-column align-items-center" id="var2">
                                                    {onToggleThree === true && <div id="thirdImageResult" className="img-zoom-result" style={{ position: "absolute", zIndex: 1, backgroundColor: "white" }}></div>}
                                                    <p className="font-20 ml-10">Perifera nerver</p>
                                                    <div className="img-zoom-container" onMouseEnter={showFourImage} onMouseLeave={() => onFourImgToggle(false)} style={{ height: "400px" }}>
                                                        <img id="absFourImg" width="0" height="0" style={{ position: "absolute" }} />
                                                        <div id="fourImage">
                                                            <PeriferaSVGBack>
                                                                {circlePriferaBack}
                                                            </PeriferaSVGBack>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>) : ''
                                }
                            </div>

                            <div className="col-6 col-md-6 h-100 text-center">
                                {onToggleSecond === true && <div id="secondImageResult" className="img-zoom-result" style={{ position: "absolute", zIndex: 1, backgroundColor: "white" }}></div>}
                                <div className="row" >
                                    <div className="col-6 col-md-6 text-center mt-5 mt-lg-0" >
                                        <div className="row" id="narImage2">
                                            <p className="font-20">När gör det ont</p>
                                            {
                                                summaryReport?.stepOneSelectedNar.length > 0 ?
                                                    summaryReport?.stepOneSelectedNar.map((item, index) => {
                                                        let img = (item.img).toString();
                                                        img = img.replace('.svg', '') + '-sm.svg';
                                                        return (
                                                            <div className="col text-center when-hurt-img" key={index}>
                                                                <img src={img} alt={item.title} />
                                                                <p className="pb-0 mt-2 font-16">{item.title}</p>
                                                            </div>
                                                        )
                                                    }) : ''
                                            }
                                        </div>
                                        <div className="row border-1 border-top pt-3" id="tidImage2">
                                            <p className="font-20">Tid</p>
                                            {
                                                summaryReport?.stepTwoSelectedTid.length > 0 ?
                                                    summaryReport?.stepTwoSelectedTid.map((item, index) => (
                                                        <div className="col text-center" key={index}>
                                                            <img src={item.icon} alt={item.title} />
                                                            <p className="pb-0 mt-2 font-16">{item.title}</p>
                                                        </div>
                                                    )) : ''
                                            }
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 text-center mt-5 mt-lg-0" id="hurImage2">
                                        <p className="font-20">Hur gör det ont</p>
                                        <div className="row cust-col2">
                                            {
                                                summaryReport?.stepThreeSelectedHur.length > 0 ?
                                                    summaryReport?.stepThreeSelectedHur.map((item, index) => (
                                                        <div className="col-4 col-lg-12 text-center" key={index}>
                                                            <img src={item.img} alt={item.title} />
                                                            <p className="pb-0 mt-2 font-16">{item.title}</p>
                                                        </div>
                                                    )) : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            frontImageVisible && backImageVisible ?
                                <div className="row d-flex cust-col">
                                    <div className="col-6 col-md-6 h-100 text-center">

                                        <>
                                            <div className="row d-flex h-70 cust-col">
                                                <div className="col-6 col-md-6 h-100 text-center d-flex flex-column align-items-center" id="var">
                                                    <p className="font-20 ml-10">Centrala nerver</p>

                                                    <div className="img-zoom-container" onMouseEnter={showThirdImage} onMouseLeave={() => onThirdImgToggle(false)} style={{ height: "400px" }}>
                                                        <div id="thirdImage">
                                                            <CentralaSVGBack>
                                                                {circleBack}
                                                            </CentralaSVGBack>
                                                        </div>
                                                        <img id="absThirdImg" width="0" height="0" style={{ position: "absolute" }} />
                                                    </div>

                                                </div>

                                                <div className="col-6 col-md-6 h-100 text-center d-flex flex-column align-items-center" id="var2">

                                                    <p className="font-20 ml-10">Perifera nerver</p>
                                                    <div className="img-zoom-container" onMouseEnter={showFourImage} onMouseLeave={() => onFourImgToggle(false)} style={{ height: "400px" }}>
                                                        <div id="fourImage">
                                                            <PeriferaSVGBack>
                                                                {circlePriferaBack}
                                                            </PeriferaSVGBack>
                                                        </div>
                                                        <img id="absFourImg" width="0" height="0" style={{ position: "absolute" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </div>
                                    {(onToggleThree === true || onToggleFour === true) &&
                                        <div className="col-6 col-md-6 h-100 text-center" style={{ marginTop: "3%" }}>
                                            {
                                                onToggleFour === true &&
                                                (<div id="fourImageResult" className="img-zoom-result" style={{ backgroundColor: "white" }}></div>)
                                            }
                                            {onToggleThree === true && <div id="thirdImageResult" className="img-zoom-result" style={{ backgroundColor: "white" }}></div>}
                                        </div>
                                    }
                                </div>
                                : ''}
                    </div>
                </div>
            </main>
            <footer className="d-flex align-items-end bg-white">
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <button className="btn btn-back d-flex" onClick={handleBack}><span className="arrow_carrot-left font-26 me-3"></span> Tillbaka</button>
                        </div>
                        <div className="col-4 d-flex justify-content-center align-items-center">
                            <span>Framtaget i samarbete med Jan Rickard Norrefalk</span>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-primary d-flex pe-0 w-130px justify-content-between ms-auto" onClick={savePdf}>Skriv ut {loading === true ? (<LoadingDots />) : (<span className="arrow_carrot-right font-26 mr--10px"></span>)}</button>
                        </div>
                    </div>
                </div>
            </footer>



            <div className="hscroll" hidden={hidden}>
                <table width="780px" style={{ textAlign: "center", position: "fixed", top: "50px", left: "0px", zIndex: "-1", backgroundColor: "white" }} cellPadding="10px" id="summary">
                    <thead>
                        <tr style={{ borderLeft: "1px solid #BCD2E8", borderRight: "1px solid #BCD2E8", borderTop: "1px solid #BCD2E8", pageBreakInside: "avoid" }}>
                            <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>Centrala nerver</p></th>
                            <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>Perifera nerver</p></th>
                            <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>När gör det ont</p></th>
                            <th style={{ paddingBottom: "0px" }}><p>Hur gör det ont</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ border: "1px solid #BCD2E8" }}>
                            {
                                frontImageVisible ?
                                    (<>
                                        <td style={{ borderRight: "1px solid #BCD2E8" }}>
                                            <svg width="208px" height="400px" id="firstImage">
                                                <CentralaFram width="100%" height="100%" />
                                                {circleFront}
                                            </svg>
                                        </td>
                                        <td style={{ borderRight: "1px solid #BCD2E8" }}>
                                            <svg width="208px" height="400px" id="secondImage">
                                                <PeriferaFram width="100%" height="100%" />
                                                {circlePriferaFront}
                                            </svg>
                                        </td>
                                    </>) : ""
                            }
                            {
                                backImageVisible ?
                                    (<>
                                        <td style={{ borderRight: "1px solid #BCD2E8" }}>
                                            <svg width="208px" height="400px" id="thirdImage">
                                                <CentralaBak width="100%" height="100%" />
                                                {circleBack}
                                            </svg>
                                        </td>
                                        <td style={{ borderRight: "1px solid #BCD2E8" }}>
                                            <svg width="208px" height="400px" id="fourImage">
                                                <PeriferaBak width="100%" height="100%" />
                                                {circlePriferaBack}
                                            </svg>
                                        </td>
                                    </>) : ''
                            }
                            <td style={{ borderRight: "1px solid #BCD2E8", padding: "0px" }}>
                                <table width="100%" id="narImage">
                                    {
                                        summaryReport?.stepOneSelectedNar.length > 0 &&
                                        summaryReport?.stepOneSelectedNar.map((item, index) => {
                                            let img = (item.img).toString();
                                            img = img.replace('.svg', '') + '-sm.svg';

                                            return (
                                                <tr key={index}>
                                                    <td style={{ padding: "10px 0px 0px 0px" }}>
                                                        <div id={`nar${index}-Image`}>
                                                            <img src={img} alt={item.title} width="76" height="72" />
                                                            <p className="pb-0 mt-2 font-16">{item.title}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </table>
                                <table width="100%" id="tidImage">
                                    <tbody>
                                        {/*<tr style={{ borderTop: "1px solid #BCD2E8", borderBottom: "1px solid #BCD2E8" }}>
                                            <td style={{ padding: "0px" }}><p className="pb-0 mt-2 font-16">Tid</p></td>
                                    </tr>*/}
                                        {
                                            summaryReport?.stepTwoSelectedTid.length > 0 &&
                                            summaryReport?.stepTwoSelectedTid.map((item, index) => (
                                                <tr >
                                                    <td style={{ padding: "10px 0px 0px 0px" }}>
                                                        <div id={`tid${index}-Image`}>
                                                            <img src={item.icon} alt={item.title} width="72" height="72" />
                                                            <p className="pb-0 mt-2 font-16">{item.title}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </td>
                            <td style={{ borderRight: "1px solid #BCD2E8", padding: "0px" }}>
                                <table width="100%" id="hurImage">
                                    <tbody>
                                        {
                                            summaryReport?.stepThreeSelectedHur.length > 0 &&
                                            summaryReport?.stepThreeSelectedHur.map((item, index) => (
                                                <tr >
                                                    <td style={{ padding: "10px 0px 0px 10px" }}>
                                                        <div id={`hur${index}-Image`}>
                                                            <img src={item.img} alt={item.title} width="113" height="72" />
                                                            <p className="pb-0 mt-2 font-16">{item.title}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table >
            </div>


        </>
    );
};

export default SummaryReport;


{/*// <div className="hscroll" hidden={hidden}>
//     <table width="780px" style={{ textAlign: "center", position: "fixed", top: "50px", left: "0px", zIndex: "-1" }} cellPadding="10px" id="summary">
//         <thead>
//             <tr style={{ borderLeft: "1px solid #BCD2E8", borderRight: "1px solid #BCD2E8", borderTop: "1px solid #BCD2E8", pageBreakInside: "avoid" }}>
//                 <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>Centrala nerver</p></th>
//                 <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>Perifera nerver</p></th>
//                 <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>När gör det ont</p></th>
//                 <th style={{ paddingBottom: "0px" }}><p>Hur gör det ont</p></th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr style={{ border: "1px solid #BCD2E8" }}>
//                 {
                    //                     frontImageVisible ?
                    //                         (<>
                    //                             <td style={{ borderRight: "1px solid #BCD2E8" }}>
                    //                                 <svg width="208px" height="360px">
                    //                                     <CentralaFram width="100%" height="100%" />
                    //                                     {circleFront}
                    //                                 </svg>
                    //                             </td>
                    //                             <td style={{ borderRight: "1px solid #BCD2E8" }}>
                    //                                 <svg width="208px" height="360px">
                    //                                     <PeriferaFram width="100%" height="100%" />
                    //                                     {circlePriferaFront}
                    //                                 </svg>
                    //                             </td>
                    //                         </>) : ""
                    //                 }
                    //                 {
                    //                     backImageVisible ?
                    //                         (<>
                    //                             <td style={{ borderRight: "1px solid #BCD2E8" }}>
                    //                                 <svg width="208px" height="360px">
                    //                                     <CentralaBak width="100%" height="100%" />
                    //                                     {circleBack}
                    //                                 </svg>
                    //                             </td>
                    //                             <td style={{ borderRight: "1px solid #BCD2E8" }}>
                    //                                 <svg width="208px" height="360px">
                    //                                     <PeriferaBak width="100%" height="100%" />
                    //                                     {circlePriferaBack}
                    //                                 </svg>
                    //                             </td>
                    //                         </>) : ''
                    //                 }

                    //             </tr>
                    //         </tbody>
                    //     </table >

                    //     <table width="780px" style={{ textAlign: "center", position: "fixed", top: "50px", left: "0px", zIndex: "-1" }} cellPadding="10px" id="summary2">
                    //         <thead>
                    //             <tr style={{ borderLeft: "1px solid #BCD2E8", borderRight: "1px solid #BCD2E8", borderTop: "1px solid #BCD2E8", pageBreakInside: "avoid" }}>
                    //                 <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>Centrala nerver</p></th>
                    //                 <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>Perifera nerver</p></th>
                    //                 <th style={{ borderRight: "1px solid #BCD2E8", paddingBottom: "0px" }}><p>När gör det ont</p></th>
                    //                 <th style={{ paddingBottom: "0px" }}><p>Hur gör det ont</p></th>
                    //             </tr>
                    //         </thead>
                    //         <tbody>
                    //             <tr>
                    //                 <td style={{ borderRight: "1px solid #BCD2E8", padding: "0px" }}>
                    //                     <table width="100%">
                    //                         <tbody>
                    //                             {
                    //                                 summaryReport?.stepOneSelectedNar.length > 0 &&
                    //                                 summaryReport?.stepOneSelectedNar.map((item, index) => {
                    //                                     let img = (item.img).toString();
                    //                                     img = img.replace('.svg', '') + '-sm.svg';

                    //                                     return (
                    //                                         <tr key={index}>
                    //                                             <td style={{ padding: "10px 0px 0px 0px" }}>
                    //                                                 <div>
                    //                                                     <img src={img} alt={item.title} width="76" height="72" />
                    //                                                     <p className="pb-0 mt-2 font-16">{item.title}</p>
                    //                                                 </div>
                    //                                             </td>
                    //                                         </tr>
                    //                                     )
                    //                                 })
                    //                             }
                    //                         </tbody>
                    //                     </table>
                    //                     <table width="100%">
                    //                         <tbody><tr style={{ borderTop: "1px solid #BCD2E8", borderBottom: "1px solid #BCD2E8" }}>
                    //                             <td style={{ padding: "0px" }}><p className="pb-0 mt-2 font-16">Tid</p></td>
                    //                         </tr>
                    //                             {
                    //                                 summaryReport?.stepTwoSelectedTid.length > 0 &&
                    //                                 summaryReport?.stepTwoSelectedTid.map((item, index) => (
                    //                                     <tr key={index}>
                    //                                         <td style={{ padding: "10px 0px 0px 0px" }}>
                    //                                             <div>
                    //                                                 <img src={item.icon} alt={item.title} width="72" height="72" />
                    //                                                 <p className="pb-0 mt-2 font-16">{item.title}</p>
                    //                                             </div>
                    //                                         </td>
                    //                                     </tr>
                    //                                 ))
                    //                             }
                    //                         </tbody>
                    //                     </table>
                    //                 </td>
                    //                 <td style={{ borderRight: "1px solid #BCD2E8", padding: "0px" }}>
                    //                     <table width="100%">
                    //                         <tbody>
                    //                             {
                    //                                 summaryReport?.stepThreeSelectedHur.length > 0 &&
                    //                                 summaryReport?.stepThreeSelectedHur.map((item, index) => (
                    //                                     <tr key={index}>
                    //                                         <td style={{ padding: "10px 0px 0px 10px" }}>
                    //                                             <div>
                    //                                                 <img src={item.img} alt={item.title} width="113" height="72" />
                    //                                                 <p className="pb-0 mt-2 font-16">{item.title}</p>
                    //                                             </div>
                    //                                         </td>
                    //                                     </tr>
                    //                                 ))
                    //                             }
                    //                         </tbody>
                    //                     </table>
                    //                 </td>
                    //             </tr>
                    //         </tbody>
                    //     </table>
                    // </div> */}