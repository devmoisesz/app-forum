import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";
import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeEncrypter } from "@/test/cryptography/fake-encrypter";
import { makeStudent } from "@/test/factories/make-student";

let studentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter
let authenticateStudentUseCase: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter()

    authenticateStudentUseCase = new AuthenticateStudentUseCase(
        studentRepository,
        fakeHasher,
        fakeEncrypter
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456')
    })

    studentRepository.create(student)

    const result = await authenticateStudentUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
        accessToken: expect.any(String)
    })
  });
});
