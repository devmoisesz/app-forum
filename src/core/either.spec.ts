import { left, right, type Either } from "./either";

function doSomething(sholdSucess: boolean): Either<string, number> {
    if (sholdSucess){
        return right(10)
    } else {
        return left('error')
    }
}

test('sucess result', () => {
    const result = doSomething(true)

    if(result.isRight()) {
        console.log(result.value)
    }

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
})

test('error result', () => {
    const result = doSomething(false)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
})