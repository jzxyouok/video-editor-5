import * as React from 'react'
import styled from 'styled-components'

const formatUrl = (slide) => `/static/thumbnails/${slide}`

export default class VideoSlider extends React.Component {

    previewTimer = null

    static defaultProps = {
        previewTimeout: 500,
        size: 90,
        thumbnails: ["out1.png", "out2.png", "out3.png", "out4.png", "out5.png", "out6.png", "out7.png", "out8.png", "out9.png", "out10.png", "out11.png", "out12.png", "out13.png", "out14.png", "out15.png", "out16.png", "out17.png", "out18.png", "out19.png", "out20.png", "out21.png", "out22.png", "out23.png", "out24.png", "out25.png", "out26.png", "out27.png", "out28.png", "out29.png", "out30.png", "out31.png", "out32.png", "out33.png", "out34.png", "out35.png", "out36.png", "out37.png", "out38.png", "out39.png", "out40.png", "out41.png", "out42.png", "out43.png", "out44.png", "out45.png", "out46.png", "out47.png", "out48.png", "out49.png", "out50.png", "out51.png", "out52.png", "out53.png", "out54.png", "out55.png", "out56.png", "out57.png", "out58.png", "out59.png"]
    }

    state = {
        position: 0,
        selectionStart: 1,
        selectionEnd: 3,
        dragSelectionEnd: 3,
        drag: false,
        dragStartX: -1,
        thumbnail: null
    }

    stopThumbnailTimer() {
        if (this.thumbnailTimer) {
            clearTimeout(this.thumbnailTimer);
        }

        this.setState({
            thumbnail: null
        })
    }

    onSlidesMouseMove = (e) => {
        this.stopThumbnailTimer()
        this.thumbnailTimer = setTimeout(this.showThumbnail(e.clientX), this.props.previewTimeout)
    }

    onSlidesMouseLeave = () => {
        this.stopThumbnailTimer()
    }

    showThumbnail(x) {
        return () => {
            const thumbnailIndex = Math.floor(x / this.props.size);

            console.log(thumbnailIndex)

            this.setState({
                thumbnail: thumbnailIndex
            })
        }
    }

    getPreviewAt() {

    }

    updatePosition = (position) => {
        return () => {
            this.setState({
                position
            })
        } 
    }

    renderSlide = (slide, index) => {
        return (
            <Slide size={this.props.size} onClick={this.updatePosition(index)} key={index}>
                <img src={formatUrl(slide)} /> 
            </Slide>
        )
    }

    renderSlides() {
        return (
            <Slides onMouseMove={this.onSlidesMouseMove} onMouseLeave={this.onSlidesMouseLeave}>
                {this.props.thumbnails.map(this.renderSlide)}

                {this.renderPosition()}
                {this.renderSelection()}
                {this.renderThumbnailPreview()}
            </Slides>
        )
    }

    renderPosition() {
        const space = this.props.size / 2
        const left = (this.state.position * (this.props.size)) + space
        return (
            <Position 
                left={left}
            />
        )
    }

    renderSelection() {
        const end = this.state.drag ? this.state.dragSelectionEnd : this.state.selectionEnd

        const left = (this.state.selectionStart * (this.props.size))
        const width = (end - this.state.selectionStart) * this.props.size

        return (
            <Selection 
                left={left}
                width={width}
            >
                <Handler left onMouseDown={this.handleDragStart}/>
                <Handler right onMouseDown={this.handleDragStart}/>
            </Selection>
        )
    }

    handleDragStart = (e) => {
        const dragStartX = e.clientX
        this.setState({ dragStartX, drag: true });

        window.addEventListener('mousemove', this.handleDrag)
        window.addEventListener('mouseup', this.handleDragEnd)
    }

    handleDrag = (e) => {
        const delta = e.clientX - this.state.dragStartX
        const deltaThumbnails = Math.floor(delta / this.props.size);
        
        const dragSelectionEnd = this.state.selectionEnd + deltaThumbnails
        this.setState({ dragSelectionEnd });
    }

    handleDragEnd = () => {
        this.stopDrag()
    }

    stopDrag = (e) => {
        const selectionEnd = this.state.dragSelectionEnd
        this.setState({ 
            selectionEnd, 
            dragStartX: -1, 
            drag: false 
        });

        window.removeEventListener('mousemove', this.handleDrag)
        window.removeEventListener('mouseup', this.handleDragEnd)
    }

    renderThumbnailPreview() {
        if (!this.state.thumbnail) {
            return null
        }

        const left = (this.state.thumbnail * (this.props.size))
        const slide = this.props.thumbnails[this.state.thumbnail];

        return (
            <Preview size={this.props.size} left={left}> 
                 <img src={formatUrl(slide)} /> 
            </Preview>
        )
    }

    render() {
        return (
            <Slider>
                {this.renderSlides()}
            </Slider> 
        )
    }

}

const Slider = styled.section`
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: #373737;
`

const Slides = styled.div`
    display: flex;
    width: 100%;
    overflow-x: scroll;
    flex-direction: row;
    padding-top: 80px;
    padding-bottom: 10px;
    position: relative;
    user-select: none;
`

const Slide = styled.div`
    cursor: pointer;
    transition: all 0.36s ease-in-out;

    &:hover {
        z-index: 1;
    }

    img {
        width: ${props => props.size}px;
    }
`

const Position = styled.div`
    width: 2px;
    border-radius: 2px;
    background: #5750d9;

    transition: all 0.16s ease-in-out;

    position: absolute;
    z-index: 4;
    height: 80px;
    bottom: 0px;
    left: 0px;
    transform: 
        translateX(${props => props.left}px);
`

const Selection = styled.div`
    border: 2px solid #18914d;
    border-radius: 4px;

    transition: all 0.16s ease-in-out;

    background: rgba(0, 0, 0, 0.5);

    position: absolute;
    z-index: 4;
    height: 80px;
    bottom: 0px;
    left: 0px;

    width: ${props => props.width}px;
    transform: 
        translateX(${props => props.left}px);
`

const Handler = styled.div`
    cursor: all-scroll;

    width: 20px;
    height: 40px;
    background: red;
    border-radius: 4px;

    position: absolute;
    
    top: 0px;

    ${props => props.left && `
        left: 0px;
        background: green;
        transform: translate3d(-10px,26px,0);
    `}

    ${props => props.right && `
        right: 0px;
        background: blue;
        transform: translate3d(10px,26px,0);
    `}
`

const Preview = Slide.extend`
    position: absolute;
    z-index: 2;
    transform: 
        translateY(calc(-100% - 10px))
        translateX(${props => props.left}px);
`