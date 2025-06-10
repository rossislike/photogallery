import * as React from "react"

// export interface IAddPhotoProps {
// }

export function AddPhoto() {
  return (
    <div>
      <h1>Add Photo</h1>
      <form>
        <div>
          <label htmlFor="photo">Photo URL:</label>
          <input type="text" id="photo" name="photo" />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="tags">Tags:</label>
          <input type="text" id="tags" name="tags" />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" />
        </div>
        <button type="submit">Add Photo</button>
      </form>
    </div>
  )
}

/*
<input type="file" name="imagefile" id="imagefile" class="form-control">
<br>
<input type="text" name="title" id="title" class="form-control" placeholder="Title">
<br>
<textarea name="description" id="description" class="form-control" rows="3" placeholder=" Description"></textarea>
<br>
<input type="text" name="tags" id="tags" class="form-control" placeholder="Tags" >

*/
