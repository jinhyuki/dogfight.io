Df.mainPage = SC.Page.design({

    mainPane: SC.MainPane.design({
        childViews: ['canvasView'],

        canvasView: Df.CanvasView.design({
            layout: { 
                top: 0, 
                right: 0, 
                bottom: 0, 
                left: 0
            }
        })
    })
});
