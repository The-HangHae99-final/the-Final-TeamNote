const httpMocks = require("node-mocks-http");
const localsUser = require("../data/locals.user.json");
const postController = require("../../src/controller/posts");
const newPost = require("../data/post.json");
const Post = require("../../src/models/post");

Post.create = jest.fn();
Post.findOne = jest.fn();
Post.find = jest.fn();
Post.deleteOne = jest.fn();
Post.updateOne = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  res.locals.User = localsUser;
});

describe("게시물 생성", () => {
  beforeEach(() => {
    res.locals.User = localsUser;
    req.body = newPost;
  });
  it("createPost는 함수이다.", () => {
    expect(typeof postController.createPost).toBe("function");
  });

  it("Post.findOne와 Post.create는 다음과 같은 내용을 호출해야한다.", async () => {
    let postId = newPost.postId;
    let workSpaceName = newPost.workSpaceName;
    let title = newPost.title;

    await postController.createPost(req, res, next);
    expect(Post.findOne).toHaveBeenCalledWith();
    expect(Post.create).toBeCalledWith({postId, workSpaceName, title}
    );
  });
  it("201 응답코드를 반환한다.", async () => {
    await postController.createPost(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("다음과 같은 json 응답값을 받아야 한다.", async () => {
    const createdWorkSpace = newWorkSpace;
    const addedOwner = {
      memberEmail: localsUser.userEmail,
      memberName: localsUser.memberName,
      workSpace: newWorkSpace.name,
    };
    workSpace.create.mockReturnValue(createdWorkSpace, addedOwner);
    await postController.createPost(req, res, next);
    expect(res._getJSONData()).toStrictEqual(createdWorkSpace, addedOwner);
  });
});
