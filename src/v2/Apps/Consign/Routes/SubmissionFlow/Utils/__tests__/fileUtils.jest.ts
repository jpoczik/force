import { Environment } from "relay-runtime"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  createGeminiAssetWithS3Credentials,
} from "../../Mutations"
import { Photo, uploadPhoto } from "../fileUtils"
import { uploadFileToS3 } from "../uploadFileToS3"

jest.mock("../../Mutations/Gemini/getConvectionGeminiKey", () => ({
  ...jest.requireActual("../../Mutations/Gemini/getConvectionGeminiKey"),
  getConvectionGeminiKey: jest.fn().mockResolvedValue("convectionKey"),
}))

jest.mock("../../Mutations/Gemini/getGeminiCredentialsForEnvironment", () => ({
  ...jest.requireActual(
    "../../Mutations/Gemini/getGeminiCredentialsForEnvironment"
  ),
  getGeminiCredentialsForEnvironment: jest.fn(),
}))

jest.mock("../../Mutations/Gemini/createGeminiAssetWithS3Credentials", () => ({
  ...jest.requireActual(
    "../../Mutations/Gemini/createGeminiAssetWithS3Credentials"
  ),
  createGeminiAssetWithS3Credentials: jest
    .fn()
    .mockResolvedValue("geminiToken"),
}))

jest.mock("../../Mutations/addAssetToConsignment", () => ({
  ...jest.requireActual("../../Mutations/addAssetToConsignment"),
  addAssetToConsignment: jest.fn(),
}))

jest.mock("../uploadFileToS3", () => ({
  ...jest.requireActual("../uploadFileToS3"),
  uploadFileToS3: jest.fn().mockResolvedValue("key"),
}))

describe("fileUtils", () => {
  let relayEnvironment = {} as Environment
  let photo: Photo
  let submission = {
    id: "1",
  }
  let updateProgress = jest.fn()

  beforeEach(() => {
    ;(getGeminiCredentialsForEnvironment as jest.Mock).mockClear()
    ;(createGeminiAssetWithS3Credentials as jest.Mock).mockClear()
    ;(getConvectionGeminiKey as jest.Mock).mockClear()
    ;(uploadFileToS3 as jest.Mock).mockClear()

    photo = {
      removed: false,
      geminiToken: "123",
      bucket: "bucket",
      size: 20000,
      name: "photo.png",
    } as Photo
  })

  describe("uploadPhoto", () => {
    it("use convectionKey to get gemini credentials", async () => {
      await uploadPhoto(submission.id, relayEnvironment, photo, updateProgress)

      expect(getConvectionGeminiKey).toHaveBeenCalled()
      expect(getGeminiCredentialsForEnvironment).toHaveBeenCalled()
      expect(getGeminiCredentialsForEnvironment).toHaveBeenCalledWith(
        relayEnvironment,
        {
          acl: "private",
          name: "convectionKey",
        }
      )
    })

    it("use assetCredentials to upload file to S3", async () => {
      const assetCredentials = {}
      ;(getGeminiCredentialsForEnvironment as jest.Mock).mockResolvedValue(
        assetCredentials
      )

      await uploadPhoto(submission.id, relayEnvironment, photo, updateProgress)

      expect(getGeminiCredentialsForEnvironment).toHaveBeenCalled()
      expect(uploadFileToS3).toHaveBeenCalled()
      expect(uploadFileToS3).toHaveBeenCalledWith(
        photo,
        "private",
        assetCredentials,
        updateProgress
      )
    })

    it("creates gemini asset with correct credentials", async () => {
      await uploadPhoto(submission.id, relayEnvironment, photo, updateProgress)

      expect(createGeminiAssetWithS3Credentials).toHaveBeenCalled()
      expect(createGeminiAssetWithS3Credentials).toHaveBeenCalledWith(
        relayEnvironment,
        {
          sourceKey: "key",
          sourceBucket: "bucket",
          templateKey: "convectionKey",
          metadata: {
            id: "1",
            _type: "Consignment",
          },
        }
      )
    })

    it("prevents uploading if the image was removed", async () => {
      photo.removed = true

      await uploadPhoto(submission.id, relayEnvironment, photo, updateProgress)

      expect(uploadFileToS3).not.toHaveBeenCalled()
    })

    it("does not attempt to get gemini credentials or file upload if no conviction key found", async () => {
      ;(getConvectionGeminiKey as jest.Mock).mockRejectedValueOnce(
        "no key found"
      )

      expect(getGeminiCredentialsForEnvironment).toHaveBeenCalledTimes(0)
      expect(uploadFileToS3).toHaveBeenCalledTimes(0)
    })

    it("return undefined when s3 upload fails", async () => {
      ;(uploadFileToS3 as jest.Mock).mockRejectedValueOnce("rejected")

      const uploadPhotoResult = await uploadPhoto(
        submission.id,
        relayEnvironment,
        photo,
        updateProgress
      )

      expect(uploadPhotoResult).toBe(undefined)
    })
  })
})
