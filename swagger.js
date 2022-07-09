const swaggerAutogen = require('swagger-autogen')();
// 본인의 설정으로 수정한다.

const outputFile = './swagger_output.json'; // swagger-autogen이 실행 후 생성될 파일 위치와 이름
const endpointsFiles = ['./server/routes/*']; // 읽어올 Router가 정의되어 있는 js파일들

//아래 코드에 .then() 이후를 삭제한다.
swaggerAutogen(outputFile, endpointsFiles);
