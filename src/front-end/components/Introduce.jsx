import React, { useState, useEffect } from "react";

import styles from "../css/Introduce.module.css";

const Introduce = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // 선택한 멤버를 저장하는 상태
  const [selectedImage, setSelectedImage] = useState(null);

  const isAdminUser = localStorage.getItem("UserType") === "Admin";

  // 모달 열기
  const openModal = (member) => {
    console.log("Open modal for member:", member);

    setEditingMember(member);
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setEditingMember(null);
    setShowModal(false);
  };

  // 수정 버튼 클릭 시 모달 열기
  const handleEditClick = (member) => {
    console.log("Edit button clicked");

    openModal(member);
  };

  // member data 가져오기
  useEffect(() => {
    const getMemberData = async () => {
      try {
        const response = await fetch("http://localhost:3300/members");
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getMemberData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setEditingMember((prevMember) => ({
        ...prevMember,
        imageSrc: imageUrl,
      }));
    }
  };

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3300/members/${editingMember.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingMember.name,
            introduction: editingMember.introduction,
            imageSrc: editingMember.imageSrc,
          }),
        }
      );

      if (response.ok) {
        const updatedMembers = teamMembers.map((member) =>
          member.id === editingMember.id
            ? { ...member, ...editingMember }
            : member
        );
        setTeamMembers(updatedMembers);
        closeModal();
      } else {
        console.error("Failed to update data on the server");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="d-flex">
      <div className="d-flex align-items-center mt-5 w-100 vh-100 flex-column">
        <h2 className="">Team Member</h2>
        <div className={styles.IntroduceDiv}>
          {/* 가져온 데이터 배열 순회 후 요소 생성 */}
          {teamMembers.map((member, index) => (
            <div className={styles.IntroduceForm} key={index}>
              <img className="" src={member.imageSrc} alt="" />

              <div className={` text-white mt-3 ${styles.IntroduceBorder} `}>
                <p className={styles.IntroduceFormP}>{member.name}</p>
                <p className="px-2">{member.introduction}</p>
              </div>
              {isAdminUser && (
                <button
                  className={styles.IntroduceButton}
                  onClick={() => handleEditClick(member)} // 수정 버튼 클릭 시 모달 열기
                >
                  수정
                </button>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <div className={styles.Modal}>
            <div className={styles.ModalContent}>
              <h3 className="mb-4 d-flex align-items-center  ">수정 모달</h3>

              <div className="mb-4">
                <p className="mb-0 ">이름</p>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => {
                    setEditingMember((prevMember) => ({
                      ...prevMember,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="mb-4">
                <p className="mb-0">내용</p>
                <textarea
                  value={editingMember.introduction}
                  onChange={(e) => {
                    setEditingMember((prevMember) => ({
                      ...prevMember,
                      introduction: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className={styles.ImgInput}>
                <label htmlFor="">
                  이미지:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="선택된 이미지"
                      style={{ maxWidth: "100%" }}
                    />
                  )}
                </label>
              </div>

              <div>
                <button onClick={handleUpdateClick}>수정완료</button>
                <button onClick={closeModal} className={styles.ModalButton}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Introduce;
