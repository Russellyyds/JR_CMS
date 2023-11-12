
function sum(a,b){
    return a+b
}

describe("test sum function",()=>{
    it("should return correct sum of two number",()=>{
        //setup (initailize - variable,mock)

        //execute the function( target)
        const result=sum(1,4)
        //compare
        expect(result).toBe(5)
    })
})