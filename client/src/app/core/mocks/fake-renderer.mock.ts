export class MockRenderer {
  createElement(name: string, namespace: string) {
    return {
      appendChild(parent: any, child: any) {
        //
      },
      getBBox() {
        return {width: 0, hight: 0, };
      },
    };
  }
  createText(text: string) {
    return {
      appendChild(parent: any, child: any) {
        //
      },
    };
  }
  parentNode(parent: any) {
    return {
      removeChild(child: any) {
        //
      },
      appendChild(child: any) {
        //
      },
    };
  }
  setAttribute(el: any, name: string, value: string) {
    //
  }
  appendChild(parent: any, child: any) {
    //
  }
  listen(htmlElement: any, event: string, dss: any) {
    //
  }
  removeChild(parent: any, child: any) {
    //
  }
  setProperty(parent: any, child: any) {
    //
  }
}
