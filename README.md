To Start Project:

- Open both the `frontend` and `backend` folders in separate terminal instances.
- In `frontend`, issue the command `npm i` to install dependencies, then `npm run dev` to start the local development server.
- In `backend`, issue the command `dotnet ef database update` to generate the database, then `dotnet restore` to install dependencies, finally `dotnet run` to build and run the server.
- Install `ResNet50-v1-7.onnx` model, found here: https://github.com/onnx/models/blob/main/validated/vision/classification/resnet/model/resnet50-v1-7.onnx, and place it in the `/backend/Models` folder.
