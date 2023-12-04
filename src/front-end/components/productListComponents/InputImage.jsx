const InputImage = ({ setImage, inputRef }) => {
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        // 이미지 미리보기 설정
        document.getElementById("preview").src = e.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      document.getElementById("preview").src = "";
    }
  };

  return (
    <input
      type="file"
      className="form-control"
      id="inputGroupFile01"
      onChange={handleFileInput}
      accept="image/*"
      ref={inputRef}
    />
  );
};

export default InputImage;
