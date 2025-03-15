export function encode(text) {
    let ttt = text 
      .replace(/0/g, "ZTW")
      .replace(/1/g, "OCi")
      .replace(/2/g, "TVX")
      .replace(/3/g, "DFR")
      .replace(/4/g, "GyUi");
      console.log(ttt)
      return ttt
  }
  
  export function decode(text) {
    let ttt = text
      .replace(/ZTW/g, "0")
      .replace(/OCi/g, "1")
      .replace(/TVX/g, "2")
      .replace(/DFR/g, "3")
      .replace(/GyUi/g, "4");
      console.log(ttt)
      return ttt
  }